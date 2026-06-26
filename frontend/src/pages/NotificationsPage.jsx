import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotifications,
  incrementPage,
  setHasMore,
  setLoading,
} from "../features/notification/notificationSlice";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import NotificationSkeleton from "../components/ui/NotificationSkeleton";

const messages = [
  "Your order has been shipped.",
  "A product in your wishlist is on sale.",
  "New arrivals are available in Electronics.",
  "Your cart item price has dropped.",
  "Flash Sale starts in 1 hour.",
  "Payment received successfully.",
  "Your order has been delivered.",
  "20% OFF on Fashion today.",
  "A new book has been added.",
  "Sports collection has been updated.",
];

function NotificationsPage() {
  const dispatch = useDispatch();
  const { items: notifications, page, hasMore, isLoading } = useSelector(
    (state) => state.notification
  );

  const generateMockNotifications = useCallback((pageNumber) => {
    dispatch(setLoading(true));
    
    // Simulate minor network delay for realistic loading skeleton/spinner
    setTimeout(() => {
      const newNotifications = [];
      for (let i = 1; i <= 15; i++) {
        const id = (pageNumber - 1) * 15 + i;
        newNotifications.push({
          id,
          title: `Notification #${id}`,
          message: messages[Math.floor(Math.random() * messages.length)],
        });
      }
      
      dispatch(addNotifications(newNotifications));
      dispatch(setLoading(false));

      // Limit mock notifications to 150 items (10 pages)
      if (pageNumber >= 10) {
        dispatch(setHasMore(false));
      }
    }, 500);
  }, [dispatch]);

  // Load first page on mount if empty
  useEffect(() => {
    if (notifications.length === 0) {
      generateMockNotifications(1);
    }
  }, [notifications.length, generateMockNotifications]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      dispatch(incrementPage());
      generateMockNotifications(nextPage);
    }
  }, [isLoading, hasMore, page, dispatch, generateMockNotifications]);

  // Connect infinite scroll observer to the last notification element
  const lastNotificationRef = useInfiniteScroll(loadMore, hasMore, isLoading);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Notifications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Stay updated with your account activity and announcements.
        </p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {notifications.map((notification, index) => {
          const isLastElement = index === notifications.length - 1;
          return (
            <div
              key={notification.id}
              ref={isLastElement ? lastNotificationRef : null}
              className="p-4 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition text-slate-800 dark:text-slate-100"
            >
              <h3 className="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1">
                {notification.title}
              </h3>
              <p className="text-sm">{notification.message}</p>
            </div>
          );
        })}
      </div>

      {isLoading && <NotificationSkeleton count={3} />}

      {!hasMore && (
        <div className="text-center py-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          🎉 That's all for now! You've seen all notifications.
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;