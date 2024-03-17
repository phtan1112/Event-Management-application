import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, FontAwesome, Fontisto } from '@expo/vector-icons';
import Colors from '../Utils/Colors';

export default function SearchBar({ setSearchText }) {
    const [searchInput, setSearchInput] = useState()
    const handleSearchSubmit = () => {
        setSearchText(searchInput);
        setSearchInput('');
    };
    return (
        <View style={{}}>
            <View style={{
                display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', padding: 18, borderRadius: 32, backgroundColor: '#F3F4F6'
            }}>
                <Fontisto name="search" size={24} color={Colors.PRIMARY} />
                <TextInput placeholder='Search...' value={searchInput}
                    onChangeText={(value) => setSearchInput(value)}
                    onSubmitEditing={handleSearchSubmit}
                    style={{ width: '100%' }} />
            </View>
        </View>
    )
}