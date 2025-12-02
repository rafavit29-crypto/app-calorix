// types/community.ts
export type PostCategory = 'Dicas' | 'Direto da Cozinha' | 'Motivação' | 'Progresso';

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: string; // ISO string
}

export interface Post {
    id: string;
    userId: string;
    userName: string;
    category: PostCategory;
    content: string; // Text content
    imageUrl?: string; // Optional image
    likes: string[]; // Array of user IDs who liked the post
    comments: Comment[];
    timestamp: string; // ISO string
}
