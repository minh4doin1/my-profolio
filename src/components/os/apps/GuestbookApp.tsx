"use client";
import { useSession, signIn, signOut } from 'next-auth/react';
import useSWR, { SWRConfig } from 'swr';
import { useState } from 'react';
import Image from 'next/image';
import { Loader2, AlertTriangle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type GuestbookEntry = {
  id: string;
  user_name: string;
  user_image: string;
  message: string;
  relation_tag: string;
  answers?: Record<string, string>;
  created_at: string;
};

const relationTags = ["Bạn bè", "Đồng nghiệp", "Nhà tuyển dụng", "Khách", "Khác"];
const tagColors: { [key: string]: string } = {
  "Bạn bè": "bg-green-500",
  "Đồng nghiệp": "bg-blue-500",
  "Nhà tuyển dụng": "bg-purple-500",
  "Khách": "bg-gray-500",
  "Khác": "bg-yellow-500",
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

const GuestbookForm = ({ mutate }: { mutate: () => void }) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [funnyMessage, setFunnyMessage] = useState('');

  const handleAnswerChange = (question: string, answer: string) => {
    if (question === 'is_handsome' && answer === 'No') {
      setFunnyMessage('Có mà');
      setAnswers(prev => ({ ...prev, [question]: 'Yes' }));
      setTimeout(() => {
        setFunnyMessage('');
      }, 2000);
      return;
    }
    setAnswers(prev => ({ ...prev, [question]: answer }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedTag) return;
    setIsSubmitting(true);

    await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, relation_tag: selectedTag, answers }),
    });

    setMessage('');
    setAnswers({});
    setSelectedTag(null);
    mutate();
    setIsSubmitting(false);
  };

  if (!session) {
    return (
      <div className="text-center p-4 border border-dashed border-gray-600 rounded-lg">
        <p className="mb-4">Sign in to leave a message!</p>
        <div className="flex justify-center space-x-4">
          <button onClick={() => signIn('github')} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Sign in with GitHub</button>
          <button onClick={() => signIn('google')} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Sign in with Google</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-3">
        <Image src={session.user?.image || '/default-avatar.png'} alt={session.user?.name || 'User Avatar'} width={40} height={40} className="rounded-full" />
        <div>
          <p>Signed in as <span className="font-bold">{session.user?.name || 'Guest'}</span></p>
          <button type="button" onClick={() => signOut()} className="text-xs text-red-400 hover:underline">Sign out</button>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="font-bold">1. Bạn là...</p>
        <div className="flex flex-wrap gap-2">
          {relationTags.map(tag => (
            <label key={tag} className={`px-3 py-1 rounded-full cursor-pointer text-sm transition-colors ${selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500'}`}>
              <input type="radio" name="relationTag" value={tag} checked={selectedTag === tag} onChange={() => setSelectedTag(tag)} className="hidden" />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedTag && (
          <motion.div 
            className="space-y-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {selectedTag === 'Bạn bè' && (
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="font-bold mb-2">2. hehe</p>
                <p>Minh có đẹp trai không?</p>
                <div className="flex items-center space-x-4 mt-2">
                  <label className="flex items-center cursor-pointer"><input type="radio" name="is_handsome" onChange={() => handleAnswerChange('is_handsome', 'Yes')} checked={answers.is_handsome === 'Yes'} className="mr-2"/> Có (Tất nhiên rồi!)</label>
                  <label className="flex items-center cursor-pointer"><input type="radio" name="is_handsome" onChange={() => handleAnswerChange('is_handsome', 'No')} checked={answers.is_handsome === 'No'} className="mr-2"/> Không</label>
                </div>
                {funnyMessage && <p className="text-xs text-yellow-400 mt-1 animate-pulse">{funnyMessage}</p>}
              </div>
            )}
            {selectedTag === 'Nhà tuyển dụng' && (
              <div className="p-3 bg-gray-700/50 rounded-lg space-y-3">
                <div>
                  <p className="font-bold mb-2">2. Bạn có lời khuyên nào để Minh cải thiện không?</p>
                  <input type="text" onChange={(e) => handleAnswerChange('advice', e.target.value)} className="w-full p-2 bg-gray-800 rounded" placeholder="Your advice..."/>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <p className="font-bold">Lời nhắn của bạn:</p>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Leave your message here..." className="w-full p-2 bg-gray-700 rounded" rows={4} required />
      </div>

      <button type="submit" disabled={isSubmitting || !selectedTag} className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
        {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={16} className="mr-2" /> Post Message</>}
      </button>
    </form>
  );
};

const GuestbookEntries = () => {
  const { data, error, isLoading } = useSWR<GuestbookEntry[]>('/api/guestbook', fetcher);

  if (isLoading) return <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="text-red-400"><AlertTriangle /> Failed to load messages.</div>;

  return (
    <div className="space-y-6 mt-8">
      {data?.map(entry => (
        <div key={entry.id} className="flex space-x-4">
          <Image src={entry.user_image} alt={entry.user_name} width={40} height={40} className="rounded-full self-start" />
          <div className="flex-grow">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="font-bold">{entry.user_name}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full text-white ${tagColors[entry.relation_tag] || 'bg-gray-500'}`}>
                {entry.relation_tag}
              </span>
            </div>
            <p className="text-gray-300 text-lg mt-1">{entry.message}</p>
            
            {entry.answers && Object.keys(entry.answers).length > 0 && (
              <div className="mt-2 text-sm text-gray-400 border-l-2 border-gray-600 pl-3 space-y-1">
                {entry.answers.is_handsome && (
                  <p className={entry.answers.is_handsome === 'No' ? 'text-[8px] opacity-50' : ''}>
                    Đánh giá về ngoại hình: {entry.answers.is_handsome === 'Yes' ? 'Đẹp trai' : 'Không'}
                  </p>
                )}
                {/* SỬA LỖI 3: Sử dụng &quot; để escape dấu nháy kép */}
                {entry.answers.advice && (
                  <p>Lời khuyên: <em>&quot;{entry.answers.advice}&quot;</em></p>
                )}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1">{new Date(entry.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const GuestbookApp = () => {
  const { mutate } = useSWR('/api/guestbook');

  return (
    <SWRConfig value={{ fetcher }}>
      <div>
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-purple-500 pb-2">Guestbook</h2>
        <GuestbookForm mutate={mutate} />
        <GuestbookEntries />
      </div>
    </SWRConfig>
  );
};

export default GuestbookApp;