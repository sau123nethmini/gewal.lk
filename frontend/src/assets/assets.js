import about_img from './about_img.jpeg';
import appointment_img from './appointment_img.jpg';
import arrow_icon from './arrow_icon.png';
import chat_icon from './chat_icon.png';
import contact_img from './contact_img.jpeg';
import cross_icon from './cross_icon.png';
import g_logo_white from './g_logo_white.png';
import g_logo from './g_logo.png';
import gewal_white from './gewal_white.png';
import gewal from './gewal.png';
import group_profiles from './group_profiles.png';
import header_img from './header_img.jpg';
import info_icon from './info_icon.png';
import menu from './menu.png';
import profile_pic from './profile_pic.png';
import upload_icon from './upload_icon.png';
import stripe_logo from './stripe_logo.png';
import razorpay_logo from './razorpay_logo.png';
import verify from './verify.png';
import dropdown from './dropdown.png';
import header from './header.png';
import login_img from './login_img.jpg';
import home from './home.png';
import vila from './vila.png';
import land from './land.png';
import studio from './studio.png';
import office from './office.png';
import appartment from './appartment.png';
import prop1 from './prop1.jpg';
import prop2 from './prop2.jpg';
import prop3 from './prop3.jpg';
import prop4 from './prop4.jpg';
import prop5 from './prop5.jpg';
import prop6 from './prop6.jpg';
import prop7 from './prop7.jpg';
import prop8 from './prop8.jpg';
import prop9 from './prop9.jpg';
import prop10 from './prop10.jpg';
import prop11 from './prop11.jpg';
import prop12 from './prop12.jpg';
import prop13 from './prop13.jpg';
import prop14 from './prop14.jpg';
import prop15 from './prop15.jpg';

export const assets = {
    about_img,
    appointment_img,
    arrow_icon,
    chat_icon,
    contact_img,
    cross_icon,
    g_logo_white,
    g_logo,
    gewal_white,
    gewal,
    group_profiles,
    header_img,
    info_icon,
    menu,
    profile_pic,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    verify,
    dropdown,
    header,
    login_img,
}

export const typeData = [
    {
        type: 'House',
        image: home
    },
    {
        type: 'Villa',
        image: vila
    },
    {
        type: 'Apartment',
        image: appartment
    },
    {
        type: 'Land',
        image: land
    },
    {
        type: 'Studio',
        image: studio
    },
    {
        type: 'Office Area',
        image: office
    },
]

export const properties = [
    {
        _id: 'prop1',
        name: 'Luxury Villa',
        image: prop1,
        type: 'Villa',
        price: 500000,
        location: {
            line1: '123 Palm Street',
            line2: 'Beverly Hills, CA'
        },
        description: 'A luxurious villa with modern amenities, spacious rooms, and a private pool. Perfect for a comfortable and elegant lifestyle.',
        features: ['Private Pool', 'Garden', 'Garage', '5 Bedrooms', '3 Bathrooms'],
        since: '2023'
    },
    {
        _id: 'prop2',
        name: 'Modern Apartment',
        image: prop2,
        type: 'Apartment',
        price: 300000,
        location: {
            line1: '456 Maple Avenue',
            line2: 'Downtown, New York'
        },
        description: 'A stylish apartment located in the heart of the city, offering convenience and modern living.',
        features: ['Gym Access', 'Rooftop Terrace', '2 Bedrooms', '2 Bathrooms'],
        since: '2022'
    },
    {
        _id: 'prop3',
        name: 'Cozy House',
        image: prop3,
        type: 'House',
        price: 200000,
        location: {
            line1: '789 Oak Drive',
            line2: 'Suburban Area, Texas'
        },
        description: 'A cozy house with a beautiful backyard, perfect for families looking for a peaceful neighborhood.',
        features: ['Backyard', 'Garage', '3 Bedrooms', '2 Bathrooms'],
        since: '2021'
    },
    {
        _id: 'prop4',
        name: 'Beachfront Villa',
        image: prop4,
        type: 'Villa',
        price: 750000,
        location: {
            line1: '321 Ocean Drive',
            line2: 'Miami, FL'
        },
        description: 'A stunning villa located right on the beach, offering breathtaking views and luxurious amenities.',
        features: ['Beach Access', 'Private Pool', '4 Bedrooms', '3 Bathrooms'],
        since: '2020'
    },
    {
        _id: 'prop5',
        name: 'Penthouse Suite',
        image: prop5,
        type: 'Apartment',
        price: 1000000,
        location: {
            line1: '789 Skyline Tower',
            line2: 'Chicago, IL'
        },
        description: 'An exclusive penthouse suite with panoramic city views and high-end finishes.',
        features: ['Rooftop Pool', 'Gym Access', '3 Bedrooms', '3 Bathrooms'],
        since: '2019'
    },
    {
        _id: 'prop6',
        name: 'Suburban Family Home',
        image: prop6,
        type: 'House',
        price: 250000,
        location: {
            line1: '456 Elm Street',
            line2: 'Austin, TX'
        },
        description: 'A spacious family home located in a quiet suburban neighborhood.',
        features: ['Backyard', 'Garage', '4 Bedrooms', '2 Bathrooms'],
        since: '2021'
    },
    {
        _id: 'prop7',
        name: 'Mountain Retreat',
        image: prop7,
        type: 'Villa',
        price: 600000,
        location: {
            line1: '123 Alpine Road',
            line2: 'Aspen, CO'
        },
        description: 'A peaceful retreat in the mountains, perfect for nature lovers.',
        features: ['Mountain Views', 'Fireplace', '3 Bedrooms', '2 Bathrooms'],
        since: '2022'
    },
    {
        _id: 'prop8',
        name: 'City Loft',
        image: prop8,
        type: 'Apartment',
        price: 350000,
        location: {
            line1: '789 Downtown Avenue',
            line2: 'Seattle, WA'
        },
        description: 'A modern loft in the heart of the city, ideal for urban living.',
        features: ['Open Floor Plan', 'Gym Access', '2 Bedrooms', '1 Bathroom'],
        since: '2023'
    },
    {
        _id: 'prop9',
        name: 'Countryside Cottage',
        image: prop9,
        type: 'House',
        price: 180000,
        location: {
            line1: '456 Country Lane',
            line2: 'Nashville, TN'
        },
        description: 'A charming cottage in the countryside, surrounded by nature.',
        features: ['Garden', 'Fireplace', '2 Bedrooms', '1 Bathroom'],
        since: '2020'
    },
    {
        _id: 'prop10',
        name: 'Lakefront Villa',
        image: prop10,
        type: 'Villa',
        price: 800000,
        location: {
            line1: '123 Lakeview Drive',
            line2: 'Orlando, FL'
        },
        description: 'A luxurious villa with direct access to the lake and stunning views.',
        features: ['Lake Access', 'Private Dock', '5 Bedrooms', '4 Bathrooms'],
        since: '2021'
    },
    {
        _id: 'prop11',
        name: 'Studio Apartment',
        image: prop11,
        type: 'Apartment',
        price: 150000,
        location: {
            line1: '456 City Center',
            line2: 'San Francisco, CA'
        },
        description: 'A compact studio apartment perfect for singles or couples.',
        features: ['Compact Design', 'City Views', '1 Bedroom', '1 Bathroom'],
        since: '2023'
    },
    {
        _id: 'prop12',
        name: 'Historic Mansion',
        image: prop12,
        type: 'House',
        price: 1200000,
        location: {
            line1: '789 Heritage Lane',
            line2: 'Charleston, SC'
        },
        description: 'A grand mansion with historic charm and modern upgrades.',
        features: ['Large Garden', 'Library', '6 Bedrooms', '5 Bathrooms'],
        since: '2018'
    },
    {
        _id: 'prop13',
        name: 'Eco-Friendly Villa',
        image: prop13,
        type: 'Villa',
        price: 550000,
        location: {
            line1: '123 Green Street',
            line2: 'Portland, OR'
        },
        description: 'A sustainable villa with eco-friendly features and modern design.',
        features: ['Solar Panels', 'Rainwater Harvesting', '4 Bedrooms', '3 Bathrooms'],
        since: '2022'
    },
    {
        _id: 'prop14',
        name: 'Luxury Condo',
        image: prop14,
        type: 'Apartment',
        price: 400000,
        location: {
            line1: '456 Highrise Avenue',
            line2: 'Atlanta, GA'
        },
        description: 'A high-end condo with premium amenities and city views.',
        features: ['Gym Access', 'Swimming Pool', '2 Bedrooms', '2 Bathrooms'],
        since: '2023'
    },
    {
        _id: 'prop15',
        name: 'Farmhouse',
        image: prop15,
        type: 'House',
        price: 300000,
        location: {
            line1: '789 Rural Road',
            line2: 'Kansas City, MO'
        },
        description: 'A spacious farmhouse surrounded by open fields and fresh air.',
        features: ['Barn', 'Large Yard', '3 Bedrooms', '2 Bathrooms'],
        since: '2020'
    }
];