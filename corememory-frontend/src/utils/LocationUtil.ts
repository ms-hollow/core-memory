import locationData from "../placeholder/philippines.json";

export interface City {
    n: string;
    b: string[];
}

export interface Region {
    id: string;
    n: string;
    p: { n: string; c: City[] }[];
}

export const capitalize = (text: string) => {
    return text
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .replace(/\s+/g, " ");
};

export const processRegionCityData = (data: Region[]) => {
    return data.map((region) => ({
        region: capitalize(region.n), 
        cities: region.p.flatMap(
            (province) => province.c.map((city) => capitalize(city.n)) 
        ),
    }));
};

export const getRegions = () => {
    const processedData = processRegionCityData(locationData);
    return processedData.map((region) => region.region);
};

export const getCitiesByRegion = (selectedRegion: string) => {
    const selectedRegionData = locationData.find(
        (region) => region.n === selectedRegion
    );
    if (selectedRegionData) {
        return selectedRegionData.p.flatMap(
            (province) => province.c.map((city) => capitalize(city.n)) 
        );
    }
    return [];
};