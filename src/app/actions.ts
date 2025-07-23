'use server'

import webpush, { PushSubscription as WebPushSubscription } from 'web-push'

webpush.setVapidDetails(
    'mailto:joos.thomas@outlook.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

let subscription: WebPushSubscription | null = null

// Type adapter to convert browser's PushSubscription to web-push's PushSubscription
function convertToWebPushSubscription(browserSub: PushSubscriptionJSON): WebPushSubscription {
    return {
        endpoint: browserSub.endpoint || '',
        expirationTime: browserSub.expirationTime,
        keys: {
            p256dh: browserSub.keys?.p256dh || '',
            auth: browserSub.keys?.auth || ''
        }
    }
}

export async function subscribeUser(sub: PushSubscriptionJSON) {
    subscription = convertToWebPushSubscription(sub)
    // In a production environment, you would want to store the subscription in a database
    // For example: await db.subscriptions.create({ data: sub })
    return { success: true }
}

export async function unsubscribeUser() {
    subscription = null
    // In a production environment, you would want to remove the subscription from the database
    // For example: await db.subscriptions.delete({ where: { ... } })
    return { success: true }
}

export async function sendNotification(message: string) {
    if (!subscription) {
        throw new Error('No subscription available')
    }

    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: 'Lumina AI',
                body: message,
                icon: '/icon.png',
            })
        )
        return { success: true }
    } catch (error) {
        console.error('Error sending push notification:', error)
        return { success: false, error: 'Failed to send notification' }
    }
}