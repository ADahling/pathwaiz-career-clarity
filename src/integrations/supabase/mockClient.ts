
import { supabase } from './client';

// Mock client that will fall back to mock data if table doesn't exist
export const enhancedSupabase = {
  from: (tableName: string) => {
    const queryBuilder = supabase.from(tableName);
    
    // Enhanced select method that falls back to mock data
    const originalSelect = queryBuilder.select;
    queryBuilder.select = function(...args: any[]) {
      try {
        return originalSelect.apply(this, args);
      } catch (error) {
        console.warn(`Table '${tableName}' might not exist yet, using mock data`);
        return {
          eq: () => mockData(tableName),
          match: () => mockData(tableName),
          order: () => mockData(tableName),
          gte: () => mockData(tableName),
          lt: () => mockData(tableName),
          single: () => mockSingleData(tableName),
          data: [],
          error: null
        };
      }
    };

    // Enhanced insert method that logs but doesn't fail
    const originalInsert = queryBuilder.insert;
    queryBuilder.insert = function(...args: any[]) {
      try {
        return originalInsert.apply(this, args);
      } catch (error) {
        console.warn(`Cannot insert into '${tableName}', table might not exist yet`);
        return {
          select: () => mockSingleData(tableName)
        };
      }
    };

    // Enhanced update method
    const originalUpdate = queryBuilder.update;
    queryBuilder.update = function(...args: any[]) {
      try {
        return originalUpdate.apply(this, args);
      } catch (error) {
        console.warn(`Cannot update table '${tableName}', it might not exist yet`);
        return {
          eq: () => ({ data: null, error: null }),
          match: () => ({ data: null, error: null })
        };
      }
    };

    return queryBuilder;
  }
};

// Mock data for different tables
function mockData(tableName: string): any {
  const now = new Date().toISOString();
  
  switch (tableName) {
    case 'bookings':
      return {
        data: [
          {
            id: '1',
            mentor_id: 'mentor-1',
            mentee_id: 'user-1',
            session_type: 'Career Advice',
            topic: 'Career transition',
            notes: 'Looking to switch from marketing to product management',
            duration: 60,
            price: 100,
            mentor_share: 80,
            platform_fee: 20,
            date: '2025-06-15',
            time: '10:00 AM',
            status: 'pending',
            payment_status: 'unpaid',
            created_at: now
          }
        ],
        error: null
      };
    case 'mentor_availability':
      return {
        data: [
          {
            id: '1',
            mentor_id: 'mentor-1',
            date: '2025-06-15',
            time: '10:00 AM',
            available: true,
            created_at: now
          },
          {
            id: '2',
            mentor_id: 'mentor-1',
            date: '2025-06-15',
            time: '11:00 AM',
            available: true,
            created_at: now
          }
        ],
        error: null
      };
    case 'availability_exceptions':
      return {
        data: [
          {
            id: '1',
            mentor_id: 'mentor-1',
            date: '2025-06-16',
            is_available: false,
            created_at: now
          }
        ],
        error: null
      };
    default:
      return {
        data: [],
        error: null
      };
  }
}

// Mock single data response
function mockSingleData(tableName: string): any {
  const data = mockData(tableName).data;
  return {
    data: data.length > 0 ? data[0] : null,
    error: null
  };
}
