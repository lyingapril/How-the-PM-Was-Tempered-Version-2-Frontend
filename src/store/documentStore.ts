import { create } from 'zustand';
import { type Document, DocumentStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

const initialDocuments: Document[] = [
  {
    id: 'doc1',
    title: '用户注册流程PRD',
    content: '<p>注册流程包含手机号验证、密码设置...</p>', // 富文本HTML
    status: DocumentStatus.PUBLISHED,
    demandId: '1', // 关联需求ID
    tags: ['PRD', '用户体验'],
    version: 1.0,
    creator: '产品经理A',
    createdAt: '2024-09-05',
    updatedAt: '2024-09-05',
  },
];

interface DocumentStore {
  documents: Document[];
  // 分页获取文档
  getDocuments: (page: number, pageSize: number) => {
    list: Document[];
    total: number;
  };
  // 获取单个文档
  getDocumentById: (id: string) => Document | undefined;
  // 创建文档
  createDocument: (doc: Omit<Document, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => void;
  // 更新文档（自动升级版本）
  updateDocument: (id: string, data: Partial<Document>) => void;
  // 删除文档
  deleteDocument: (id: string) => void;
  // 搜索文档（按标题/标签）
  searchDocuments: (keyword: string) => Document[];
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: initialDocuments,

  getDocuments: (page, pageSize) => {
    const list = get().documents;
    return {
      list: list.slice((page - 1) * pageSize, page * pageSize),
      total: list.length,
    };
  },

  getDocumentById: (id) => get().documents.find(doc => doc.id === id),

  createDocument: (doc) => {
    const newDoc: Document = {
      ...doc,
      id: uuidv4(),
      version: 1.0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    set(state => ({ documents: [...state.documents, newDoc] }));
  },

  updateDocument: (id, data) => {
    set(state => ({
      documents: state.documents.map(doc => {
        if (doc.id === id) {
          // 每次更新版本号+0.1
          const newVersion = (doc.version || 1.0) + 0.1;
          return { 
            ...doc, 
            ...data, 
            version: Number(newVersion.toFixed(1)), // 保留1位小数
            updatedAt: new Date().toISOString().split('T')[0] 
          };
        }
        return doc;
      }),
    }));
  },

  deleteDocument: (id) => {
    set(state => ({ documents: state.documents.filter(doc => doc.id !== id) }));
  },

  searchDocuments: (keyword) => {
    return get().documents.filter(doc => 
      doc.title.includes(keyword) || 
      doc.tags.some(tag => tag.includes(keyword))
    );
  },
}));