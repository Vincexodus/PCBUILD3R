export interface Session {
  _id: string;
  _feedbackId: string;
  _productId: string;
  completion: number;
  createdAt: Date;
  version: Number;
}
