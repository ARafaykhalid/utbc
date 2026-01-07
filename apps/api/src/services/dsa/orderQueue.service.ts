type OrderJob = {
  orderId: string;
  userId: string;
};

const orderQueue: OrderJob[] = [];

export const enqueueOrder = (job: OrderJob) => {
  orderQueue.push(job);
};

export const dequeueOrder = (): OrderJob | null => {
  if (orderQueue.length === 0) return null;
  return orderQueue.shift()!;
};

export const peekNextOrder = () => {
  return orderQueue[0] ?? null;
};
