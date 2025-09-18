// services/buddyService.js
const BUDDY_API_URL = 'https://valorant-api.com/v1/buddies';
const buddyCache = new Map();

export const buddyService = {
  async fetchAllBuddies() {
    try {
      const response = await fetch(BUDDY_API_URL);
      const data = await response.json();
      
      if (data.status === 200 && data.data) {
        // Cache all buddies by UUID
        data.data.forEach(buddy => {
          buddyCache.set(buddy.uuid.toLowerCase(), buddy);
        });
        return buddyCache;
      }
    } catch (error) {
      console.error('Failed to fetch buddies:', error);
    }
    return buddyCache;
  },

  async getBuddyNameByUUID(uuid) {
    if (!uuid) return null;
    
    const normalizedUUID = uuid.toLowerCase();
    
    // Check cache first
    if (buddyCache.has(normalizedUUID)) {
      return buddyCache.get(normalizedUUID).displayName;
    }
    
    // If not in cache, try to fetch all buddies
    await this.fetchAllBuddies();
    
    // Check cache again after fetching
    if (buddyCache.has(normalizedUUID)) {
      return buddyCache.get(normalizedUUID).displayName;
    }
    
    return null;
  },

  // Preload all buddies on app initialization
  async preloadBuddies() {
    await this.fetchAllBuddies();
  }
};