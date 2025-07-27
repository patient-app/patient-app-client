'use server'

import { cookies } from 'next/headers';

// Type definition for PushSubscriptionJSON
interface PushSubscriptionJSON {
    endpoint?: string;
    expirationTime?: number | null;
    keys?: {
        p256dh?: string;
        auth?: string;
    };
}

export async function subscribeUser(sub: PushSubscriptionJSON) {
    try {
        // Subscription
        const subscriptionData = {
            endpoint: sub.endpoint,
            keys: sub.keys
        };
        // Explicitly log p256dh and auth key values before sending to backend
        console.log('[subscribeUser] p256dh:', sub?.keys?.p256dh);
        console.log('[subscribeUser] auth:', sub?.keys?.auth);
        console.log('[subscribeUser] Sending subscription data:', subscriptionData);

        // Get all cookies from the client request
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        const cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
        
        console.log('[subscribeUser] Forwarding cookies:', cookieHeader);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/notification/subscribe`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader, // Forward the client's cookies
            },
            body: JSON.stringify(subscriptionData),
        });
        
        console.log('[subscribeUser] Response status:', response.status);
        console.log('[subscribeUser] Response status text:', response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'No error text available');
            console.error('[subscribeUser] Error response body:', errorText);
            throw new Error(`Failed to subscribe: ${response.status} ${response.statusText}`);
        }

        console.log('[subscribeUser] Successfully subscribed to push notifications');
        
        return { success: true };
    } catch (error) {
        console.error('[subscribeUser] Error subscribing to push notifications:', error);
        return { success: false, error: 'Failed to subscribe to push notifications' };
    }
}

export async function sendNotification(message: string) {
    try {
        console.log('[sendNotification] Starting notification sending process');
        console.log('[sendNotification] Message to send:', message);
        console.log('[sendNotification] Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
        
        // Get all cookies from the client request
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        const cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
        
        console.log('[sendNotification] Forwarding cookies:', cookieHeader);
        
        // First, get the patient ID
        console.log('[sendNotification] Fetching patient data...');
        const patientResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/me`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Cookie': cookieHeader, // Forward the client's cookies
            },
        });
        
        console.log('[sendNotification] Patient response status:', patientResponse.status);
        console.log('[sendNotification] Patient response status text:', patientResponse.statusText);
        
        if (!patientResponse.ok) {
            const errorText = await patientResponse.text().catch(() => 'No error text available');
            console.error('[sendNotification] Error response body for patient data:', errorText);
            throw new Error(`Failed to fetch patient data: ${patientResponse.status} ${patientResponse.statusText}`);
        }
        
        const patientData = await patientResponse.json();
        console.log('[sendNotification] Patient data received:', patientData);
        
        const patientId = patientData.id;
        console.log('[sendNotification] Patient ID:', patientId);
        
        if (!patientId) {
            throw new Error('Patient ID not found');
        }
        
        // Then, send the notification
        const notificationUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}/send?message=${encodeURIComponent(message)}`;
        console.log('[sendNotification] Sending notification to URL:', notificationUrl);
        
        const response = await fetch(notificationUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Cookie': cookieHeader, // Forward the client's cookies
            },
        });
        
        console.log('[sendNotification] Notification response status:', response.status);
        console.log('[sendNotification] Notification response status text:', response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'No error text available');
            console.error('[sendNotification] Error response body for notification:', errorText);
            throw new Error(`Failed to send notification: ${response.status} ${response.statusText}`);
        }
        
        console.log('[sendNotification] Notification sent successfully');
        return { success: true };
    } catch (error) {
        console.error('[sendNotification] Error sending push notification:', error);
        return { success: false, error: 'Failed to send notification' };
    }
}