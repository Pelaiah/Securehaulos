import { InvitePageClient } from './InvitePageClient';

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = await params;
  return <InvitePageClient token={resolvedParams.token} />;
}
