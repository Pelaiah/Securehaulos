import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ROLE_HOME: Record<string, string> = {
  Shipper: '/dashboard/shipper',
  Carrier: '/dashboard/carrier',
  Driver: '/dashboard/driver',
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  const isDashboardRoute = path.startsWith('/dashboard')
  const isOnboardingRoute = path.startsWith('/onboarding')

  if (!isDashboardRoute && !isOnboardingRoute) return response

  // Unauthenticated users always go to login
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  // Read user_type and status from the users table
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('user_type, status')
    .eq('id', user.id)
    .single()

  // If DB read fails (e.g. RLS, network), don't loop — just let the request through
  if (dbError) {
    return response
  }

  const userType = userData?.user_type as string | undefined
  const userStatus = userData?.status as string | undefined
  const hasCompletedOnboarding = !!userType && !!ROLE_HOME[userType]
  const isPending = userStatus === 'Pending'
  const isPendingRoute = path.startsWith('/pending-approval')

  if (!isDashboardRoute && !isOnboardingRoute && !isPendingRoute) return response

  // If pending, they can only access the pending-approval page
  if (isPending) {
    if (isPendingRoute) return response
    return NextResponse.redirect(new URL('/pending-approval', request.url))
  }

  // If NOT pending, they shouldn't be on the pending page
  if (isPendingRoute && !isPending) {
    return NextResponse.redirect(new URL(hasCompletedOnboarding ? ROLE_HOME[userType] : '/onboarding', request.url))
  }

  // Authenticated, no user_type yet → needs onboarding
  if (!hasCompletedOnboarding) {
    // Let them stay on any /onboarding/* page freely
    if (isOnboardingRoute) return response
    // Block /dashboard and send to onboarding
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Onboarding complete — don't let them back into /onboarding
  if (isOnboardingRoute) {
    return NextResponse.redirect(new URL(ROLE_HOME[userType], request.url))
  }

  // Dashboard routing: redirect /dashboard root and enforce role boundaries
  if (isDashboardRoute) {
    if (path === '/dashboard') {
      return NextResponse.redirect(new URL(ROLE_HOME[userType], request.url))
    }

    const isOnWrongSection = Object.keys(ROLE_HOME).some(
      (r) => r !== userType && path.startsWith(`/dashboard/${r.toLowerCase()}`)
    )

    if (isOnWrongSection) {
      return NextResponse.redirect(new URL(ROLE_HOME[userType], request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/pending-approval'],
}
