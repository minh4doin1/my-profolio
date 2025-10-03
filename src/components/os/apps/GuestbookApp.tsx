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

const questionsByTag: Record<string, { id: string; question: string; type: 'radio' | 'text'; options?: string[] }[]> = {
  "Bạn bè": [
    { id: 'is_handsome', question: 'Minh có đẹp trai không?', type: 'radio', options: ['Có (Tất nhiên)', 'Không'] },
    { id: 'best_memory', question: 'Kỷ niệm đáng nhớ nhất của chúng ta là gì?', type: 'text' },
    { id: 'future_plan', question: 'Chúng ta nên đi chơi ở đâu vào lần tới?', type: 'text' },
  ],
  "Đồng nghiệp": [
    { id: 'first_impression', question: 'Ấn tượng đầu tiên của bạn về Minh là gì?', type: 'text' },
    { id: 'work_skill', question: 'Bạn đánh giá cao nhất kỹ năng nào của Minh trong công việc?', type: 'text' },
    { id: 'advice_for_me', question: 'Bạn có góp ý gì để mình cải thiện trong công việc không?', type: 'text' },
  ],
  "Nhà tuyển dụng": [
    { id: 'portfolio_impression', question: 'Bạn ấn tượng nhất với dự án nào trong portfolio này?', type: 'text' },
    { id: 'tech_stack_fit', question: 'Stack công nghệ của Minh có phù hợp với vị trí mà bạn đang tìm kiếm?', type: 'radio', options: ['Rất phù hợp', 'Phù hợp', 'Cần cải thiện'] },
    { id: 'improvement_advice', question: 'Bạn có lời khuyên nào để Minh cải thiện portfolio hoặc kỹ năng không?', type: 'text' },
  ],
  "Khách": [
    { id: 'how_found', question: 'Bạn biết đến portfolio này từ đâu?', type: 'text' },
    { id: 'most_liked', question: 'Bạn thích nhất tính năng nào của "Portfolio OS" này?', type: 'text' },
    { id: 'suggestion', question: 'Bạn có gợi ý tính năng nào mới cho portfolio này không?', type: 'text' },
  ],
  "Khác": [
    { id: 'relation_clarify', question: 'Bạn có thể chia sẻ thêm về mối quan hệ của chúng ta không?', type: 'text' },
    { id: 'reason_to_visit', question: 'Lý do bạn ghé thăm portfolio này là gì?', type: 'text' },
    { id: 'any_comment', question: 'Bạn có muốn để lại lời nhắn gì khác không?', type: 'text' },
  ],
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

const GuestbookForm = ({ mutate }: { mutate: () => void }) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [funnyMessage, setFunnyMessage] = useState('');

  const handleAnswerChange = (questionId: string, answer: string) => {
    if (questionId === 'is_handsome' && answer === 'Không') {
      setFunnyMessage('Có mà');
      setAnswers(prev => ({ ...prev, [questionId]: 'Có (Tất nhiên rồi!)' }));
      setTimeout(() => { setFunnyMessage(''); }, 2000);
      return;
    }
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || (session && !selectedTag)) return;
    setIsSubmitting(true);

    const body = session
      ? { message, relation_tag: selectedTag, answers }
      : { message, guest_name: guestName || 'Anonymous' };

    await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setMessage('');
    setAnswers({});
    setSelectedTag(null);
    setGuestName('');
    mutate();
    setIsSubmitting(false);
  };

  if (session) {
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
          <p className="font-bold">1. Mối quan hệ của chúng ta là gì?</p>
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
              className="space-y-4 overflow-hidden p-3 bg-gray-700/50 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="font-bold text-lg border-b border-gray-600 pb-2">Một vài câu hỏi nhỏ...</p>
              {questionsByTag[selectedTag]?.map((q, index) => (
                <div key={q.id}>
                  <p className="font-semibold mb-2">{index + 2}. {q.question}</p>
                  {q.type === 'text' && (
                    <input
                      type="text"
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      value={answers[q.id] || ''}
                      className="w-full p-2 bg-gray-800 rounded"
                      placeholder="Câu trả lời của bạn..."
                    />
                  )}
                  {q.type === 'radio' && (
                    <div className="flex items-center space-x-4 mt-2">
                      {q.options?.map(opt => (
                        <label key={opt} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={q.id}
                            onChange={() => handleAnswerChange(q.id, opt)}
                            checked={answers[q.id] === opt}
                            className="mr-2"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                  {q.id === 'is_handsome' && funnyMessage && (
                    <p className="text-xs text-yellow-400 mt-1 animate-pulse">{funnyMessage}</p>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <p className="font-bold">Lời nhắn của bạn:</p>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Để lại lời nhắn của bạn ở đây..." className="w-full p-2 bg-gray-700 rounded" rows={4} required />
        </div>
        <button type="submit" disabled={isSubmitting || !selectedTag} className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={16} className="mr-2" /> Gửi lời nhắn</>}
        </button>
      </form>
    );
  }

  return (
    <div>
      <div className="text-center mt-4">
        <p className="mb-2 text-gray-400">Đăng nhập để có nhiều lựa chọn hơn</p>
        <div className="flex justify-center flex-wrap gap-2">
          <button onClick={() => signIn('github')} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Đăng nhập với GitHub</button>
          <button onClick={() => signIn('google')} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Đăng nhập với Google</button>
          <button onClick={() => signIn('linkedin')} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Đăng nhập với LinkedIn</button>
        </div>
      </div>      
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-dashed border-gray-600 rounded-lg">
        <p className="font-bold">Hoặc để lại lời nhắn với tư cách Khách</p>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Tên của bạn (không bắt buộc)"
          className="w-full p-2 bg-gray-700 rounded"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Lời nhắn của bạn..."
          className="w-full p-2 bg-gray-700 rounded"
          rows={4}
          required
        />
        <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-500">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={16} className="mr-2" /> Gửi lời nhắn</>}
        </button>
      </form>
    </div>
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
              <span className={`px-2 py-0.5 text-xs rounded-full text-white ${tagColors[entry.relation_tag] || 'bg-gray-500'}`}>{entry.relation_tag}</span>
            </div>
            <p className="text-gray-300 text-lg mt-1">{entry.message}</p>
            {entry.answers && Object.keys(entry.answers).length > 0 && (
              <div className="mt-2 text-sm text-gray-400 border-l-2 border-gray-600 pl-3 space-y-1">
                {Object.entries(entry.answers).map(([key, value]) => (
                  <p key={key}>
                    <span className="capitalize font-semibold">{key.replace(/_/g, ' ')}: </span>
                    <em>&quot;{value}&quot;</em>
                  </p>
                ))}
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