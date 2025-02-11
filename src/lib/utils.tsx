export function cn(...classes: (string | undefined | false)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  
  // File: src/pages/index.tsx
  import ChatWidget from '@/components/ChatWidget';
  
  export default function Home() {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <h1 className="text-4xl font-bold">Welcome to the Chat Widget!</h1>
        <ChatWidget />
      </div>
    );
  }