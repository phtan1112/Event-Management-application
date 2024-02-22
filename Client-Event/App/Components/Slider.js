import { View, Text, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Colors from '../Utils/Colors';

export default function Slider() {
    const [currentPage, setCurrentPage] = useState(0);
    console.log("currentPage", currentPage);

    const sliderList = [
        {
            id: 1,
            name: 'Slider 1',
            imageUrl: 'https://mobisoftinfotech.com/resources/wp-content/uploads/2023/02/thumbnail-HIPAA-Compliance-Guide-for-2024.png'
        },
        {
            id: 2,
            name: 'Slider 2',
            imageUrl: 'https://mobisoftinfotech.com/resources/wp-content/uploads/2023/03/thumbnail-remote-patient-monitoring-trends.png'
        },
        {
            id: 3,
            name: 'Slider 3',
            imageUrl: 'https://mobisoftinfotech.com/resources/wp-content/uploads/2023/03/thumbnail-remote-patient-monitoring-trends.png'
        },
        {
            id: 4,
            name: 'Slider 4',
            imageUrl: 'https://mobisoftinfotech.com/resources/wp-content/uploads/2023/03/thumbnail-remote-patient-monitoring-trends.png'
        }
    ];

    const handlePagination = (index) => {
        setCurrentPage(index);
    };

    return (
        <View style={{ marginTop: 10 }}>
            <FlatList
                data={sliderList}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={{ width: Dimensions.get('screen').width * 0.85, height: 200, margin: 5, borderRadius: 16 }}
                    />
                )}
                pagingEnabled
                onScroll={(event) => {
                    const containerWidth = event.nativeEvent.layoutMeasurement.width;
                    const contentOffsetX = event.nativeEvent.contentOffset.x;
                    const index = Math.round(contentOffsetX / containerWidth);
                    setCurrentPage(index);
                }}
                keyExtractor={(item) => item.id.toString()}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                {sliderList.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handlePagination(index)}
                        style={{
                            width: currentPage === index ? 14 : 10,
                            height: currentPage === index ? 14 : 10,
                            borderRadius: 10,
                            backgroundColor: currentPage === index ? Colors.PRIMARY : 'gray',
                            marginHorizontal: 15,
                            marginVertical: 10,
                            pointerEvents: 'none'
                        }}
                    />
                ))}
            </View>
        </View>
    );
}

