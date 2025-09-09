import { redirect } from 'next/navigation';

export default function Home() {
  // Immediately redirect to login page
  redirect('/auth/login');
}
