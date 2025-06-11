import { Button } from "@/components/ui/button"
import { usePushNotification } from "@/hooks/usePushNotification"
import { Bell, BellOff } from "lucide-react"

export function PushNotificationToggle() {
  const { subscription, permission, subscribeToNotifications, unsubscribeFromNotifications } = usePushNotification()

  const handleToggle = async () => {
    try {
      if (subscription) {
        await unsubscribeFromNotifications()
      } else {
        await subscribeToNotifications()
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error)
    }
  }

  if (permission === 'denied') {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        title="Push notifications are blocked. Please enable them in your browser settings."
      >
        <BellOff className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      title={subscription ? 'Disable push notifications' : 'Enable push notifications'}
    >
      {subscription ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
    </Button>
  )
} 