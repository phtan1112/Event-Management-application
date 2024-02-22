import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";

export default function Header() {
    const { isLoaded, isSignedIn, user } = useUser()
    if (!isLoaded || !isSignedIn) {
        return null
    }
    const [data, setData] = useState(null);

    const demoUser = {
        email: 'tanphuocdt1@gmail.com',
        password: "123456"
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://3512-113-161-39-209.ngrok-free.app/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(demoUser),
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Data:', data.message);
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.log(error)
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    console.log(user.fullName)
    const cleanedFullName = user.fullName.replace(/\s+/g, ' ').trim();
    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 7, alignItems: 'center' }}>
                <Image source={{ uri: user.imageUrl }} style={{ width: 45, height: 45, borderRadius: 99 }} />
                <View>
                    <Text style={{ fontFamily: 'appFont' }}>Welcome, 👋</Text>
                    <Text style={{ fontFamily: 'appFont-bold', fontSize: 18, fontWeight: 'bold' }}>{cleanedFullName}</Text>
                </View>
            </View>
            <Ionicons name='notifications-outline' size={30} color="black" />
        </View>
    )
}

const styles = StyleSheet.create({


});