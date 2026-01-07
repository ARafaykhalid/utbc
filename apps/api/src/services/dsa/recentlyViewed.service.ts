const MAX_VIEWED = 10;

const recentlyViewedMap = new Map<string, string[]>();

export const pushRecentlyViewed = (userId: string, productId: string) => {
  const stack = recentlyViewedMap.get(userId) ?? [];

  const filtered = stack.filter((id) => id !== productId);
  filtered.push(productId);

  if (filtered.length > MAX_VIEWED) {
    filtered.shift();
  }

  recentlyViewedMap.set(userId, filtered);
};

export const getRecentlyViewed = (userId: string) => {
  return (recentlyViewedMap.get(userId) ?? []).slice().reverse();
};
