import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Post, PostCategory } from '../types/community';
import { v4 as uuidv4 } from 'uuid';

const MOCK_POSTS: Post[] = [
  {
    id: uuidv4(),
    userId: 'user1',
    userName: 'Ana Fitness',
    category: 'Progresso',
    content: 'Hoje completei 30 dias de treino sem falhar! Me sentindo muito mais forte e com mais energia. Não desistam dos seus objetivos! 💪',
    imageUrl: 'https://via.placeholder.com/400x200/a78bfa/ffffff?text=Progresso',
    likes: ['user2', 'user3'],
    comments: [{id: uuidv4(), userId: 'user2', userName: 'João Saudável', text: 'Parabéns, Ana! Que inspiração!', timestamp: new Date().toISOString()}],
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: uuidv4(),
    userId: 'user2',
    userName: 'João Saudável',
    category: 'Dicas',
    content: 'Uma dica de ouro para beber mais água: tenha sempre uma garrafa por perto! Eu uso uma de 1 litro e reabasteço 3 vezes ao dia. Funciona! 💧',
    likes: ['user1'],
    comments: [],
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: uuidv4(),
    userId: 'user3',
    userName: 'Chef Fit',
    category: 'Direto da Cozinha',
    content: 'Experimentei uma receita nova de panqueca de banana com aveia, ficou uma delícia! Super fácil e nutritiva para o café da manhã.',
    imageUrl: 'https://via.placeholder.com/400x200/6ee7b7/ffffff?text=Receita+Fit',
    likes: [],
    comments: [{id: uuidv4(), userId: 'user1', userName: 'Ana Fitness', text: 'Compartilha a receita!!', timestamp: new Date().toISOString()}],
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },
];

const CommunityScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [filter, setFilter] = useState<PostCategory | 'Todos'>('Todos');

  const filteredPosts = filter === 'Todos' ? posts : posts.filter(post => post.category === filter);

  const handleLike = (postId: string, userId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes.includes(userId)
                ? post.likes.filter(id => id !== userId)
                : [...post.likes, userId],
            }
          : post
      )
    );
  };

  const categories: (PostCategory | 'Todos')[] = ['Todos', 'Dicas', 'Direto da Cozinha', 'Motivação', 'Progresso'];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Comunidade</h2>

      {/* Filter Buttons */}
      <Card className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={filter === cat ? 'primary' : 'secondary'}
            onClick={() => setFilter(cat)}
            className="px-4 py-2 text-sm"
          >
            {cat}
          </Button>
        ))}
      </Card>

      {/* Post List */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <Card key={post.id} className="p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 text-gray-600 dark:text-gray-300 font-bold">
                  {post.userName[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{post.userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">{post.content}</p>
              {post.imageUrl && (
                <img src={post.imageUrl} alt="Post image" className="rounded-lg mb-3 max-h-48 w-full object-cover" />
              )}
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-600 pt-3">
                <button
                  onClick={() => handleLike(post.id, 'currentUserEmail')} // Replace with actual current user ID
                  className={`flex items-center mr-4 focus:outline-none ${post.likes.includes('currentUserEmail') ? 'text-primary' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                  </svg>
                  {post.likes.length} Curtir
                </button>
                <button className="flex items-center focus:outline-none hover:text-gray-700 dark:hover:text-gray-200">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 13.5V16a1 1 0 01-1 1H4a1 1 0 01-1-1v-2.5a1 1 0 011-1h12a1 1 0 011 1zM11 6a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd"></path>
                  </svg>
                  {post.comments.length} Comentar
                </button>
              </div>
              {post.comments.length > 0 && (
                <div className="mt-4 border-t border-gray-100 dark:border-gray-600 pt-3 space-y-2">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-600 p-2 rounded-lg text-sm">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{comment.userName}</p>
                      <p className="text-gray-700 dark:text-gray-200">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Nenhum post encontrado para esta categoria.</p>
        )}
      </div>
    </div>
  );
};

export default CommunityScreen;