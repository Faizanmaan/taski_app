import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '../store/taskSlice';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  constructor() {}

  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
      });
    }

    return true;
  }

  async scheduleTaskNotification(task: Task) {
    if (!task.remindAt) return;

    const remindAtDate = new Date(task.remindAt);
    const now = new Date();

    if (remindAtDate <= now) {
      console.log('Reminder time is in the past, skipping scheduling');
      return;
    }

    await this.cancelTaskNotification(task.id);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Reminder',
        body: task.title,
        data: { taskId: task.id },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: remindAtDate,
      },
      identifier: task.id,
    });

    console.log(`Notification scheduled for task ${task.id} at ${remindAtDate}`);
  }

  async cancelTaskNotification(taskId: string) {
    await Notifications.cancelScheduledNotificationAsync(taskId);
    console.log(`Notification cancelled for task ${taskId}`);
  }
}

export default new NotificationService();
