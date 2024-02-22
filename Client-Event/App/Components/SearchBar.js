import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Utils/Colors';

export default function SearchBar({ setSearchText }) {
    const [searchInput, setSearchInput] = useState()
    return (
        <View style={{ marginTop: 15 }}>
            <View style={{
                display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', borderWidth: 0.6,
                borderColor: Colors.GRAY, padding: 8, borderRadius: 8
            }}>
                <Ionicons name='search-outline' size={24} color="black" />
                <TextInput placeholder='Search...'
                    onChangeText={(value) => setSearchInput(value)}
                    onSubmitEditing={() => setSearchText(searchInput)}
                    style={{ width: '100%' }} />
            </View>
        </View>
    )
}