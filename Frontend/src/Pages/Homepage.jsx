import React, { useState } from 'react';
import { Search, User, Heart, ShoppingCart, ChevronLeft, ChevronRight, Menu, X, Star, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bestsellers = [
    { id: 1, title: "The Midnight Library", author: "Matt Haig", price: "NPR18.99", rating: 4.5 },
    
  ];
  
  const newArrivals = [
    { id: 1, title: "The Atlas Paradox", author: "Olivie Blake", price: "NPR24.99", rating: 4.3 },
    
  ];
  
  const authors = [
   
    { id: 3, name: "Stephen King", books: 64, genre: "Horror, Suspense" }
  ];
  
  const heroBooks = [
    { id: 1, title: "BEWILDERMENT", author: "Lauren Asher", discount: "30% OFF" },
    { id: 2, title: "Fourth Wing", author: "Rebecca Yarros", discount: "25% OFF" },
    { id: 3, title: "It Ends With Us", author: "Colleen Hoover", discount: "35% OFF" }
  ];
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroBooks.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroBooks.length - 1 : prev - 1));
  };
  const genres = [
    {
      id: 1,
      name: "Arts & Photography",
      icon: "🎨",
      iconColor: "rgb(218, 68, 240)",
      iconBg: "rgb(250, 242, 255)"
    },
    {
      id: 2,
      name: "Boxed Sets",
      icon: "📦",
      iconColor: "rgb(240, 147, 43)",
      iconBg: "rgb(255, 246, 232)"
    },
    {
      id: 3,
      name: "Business and Investing",
      icon: "💼",
      iconColor: "rgb(158, 93, 44)",
      iconBg: "rgb(255, 246, 232)"
    },
    {
      id: 4,
      name: "Fiction and Literature",
      icon: "🎭",
      iconColor: "rgb(255, 127, 49)",
      iconBg: "rgb(255, 246, 239)"
    },
    {
      id: 5,
      name: "Foreign Languages",
      icon: "🗣️",
      iconColor: "rgb(49, 107, 255)",
      iconBg: "rgb(239, 243, 255)"
    },
    {
      id: 6,
      name: "History, Biography, and Politics",
      icon: "💬",
      iconColor: "rgb(28, 178, 226)",
      iconBg: "rgb(236, 249, 255)"
    },
    {
      id: 7,
      name: "Kids and Teens",
      icon: "😊",
      iconColor: "rgb(240, 55, 165)",
      iconBg: "rgb(255, 239, 248)"
    },
    {
      id: 8,
      name: "Learning and Reference",
      icon: "🍃",
      iconColor: "rgb(110, 110, 110)",
      iconBg: "rgb(245, 245, 245)"
    },
    {
      id: 9,
      name: "Lifestyle and Wellness",
      icon: "🧘",
      iconColor: "rgb(37, 208, 97)",
      iconBg: "rgb(237, 255, 242)"
    },
    {
      id: 10,
      name: "Manga and Graphic Novels",
      icon: "🌊",
      iconColor: "rgb(28, 178, 226)",
      iconBg: "rgb(236, 249, 255)"
    }
  ];
  
  const scrollLeft = () => {
    document.getElementById('genres-container').scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    document.getElementById('genres-container').scrollBy({ left: 300, behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 NPR{i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-red-500 to-blue-500 text-white py-2 px-4">
        <div className="container mx-auto flex justify-center items-center text-sm font-medium">
          Summer sale discount 60% off! 
          <a href="#" className="ml-2 underline hover:text-white/90 transition">Shop Now</a>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="text-2xl font-bold flex items-center">
              <span className="text-red-500">K</span>indel
              <span className="text-red-500">V</span>erse
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors">HOME</a>
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors">SHOP</a>
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors">NEW RELEASES</a>
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors">AUTHORS</a>
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors">BLOG</a>
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors">CONTACT</a>
            </nav>
            
            {/* Icons */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              <button aria-label="Search" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button aria-label="Account" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <User className="h-5 w-5" />
              </button>
              <button aria-label="Wishlist" className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button aria-label="Cart" className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <ShoppingCart className="h-5 w-5" />
             </button>
              
              <button 
                className="lg:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-200 shadow-lg">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors py-2 border-b border-neutral-100">HOME</a>
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors py-2 border-b border-neutral-100">SHOP</a>
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors py-2 border-b border-neutral-100">NEW RELEASES</a>
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors py-2 border-b border-neutral-100">AUTHORS</a>
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors py-2 border-b border-neutral-100">BLOG</a>
              <a href="#" className="font-medium text-sm hover:text-red-500 transition-colors py-2">CONTACT</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-neutral-100 to-pink-50 overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          <div className="absolute inset-y-0 left-2 flex items-center z-10">
            <button 
              onClick={prevSlide}
              className="bg-white/70 hover:bg-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
          
          <div className="absolute inset-y-0 right-2 flex items-center z-10">
            <button 
              onClick={nextSlide}
              className="bg-white/70 hover:bg-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col justify-center order-2 md:order-1">
                <div className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold md:hidden">
                  {heroBooks[currentSlide].discount}
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
                  {heroBooks[currentSlide].title}
                </h1>
                <p className="text-lg sm:text-xl mb-2 text-neutral-600">By {heroBooks[currentSlide].author}</p>
                <p className="text-xl sm:text-2xl font-medium mb-8">Best Offer <span className="text-red-500">{heroBooks[currentSlide].discount}</span>. Grab it now!</p>
                
                <div className="flex space-x-4">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                    Shop Now
                  </button>
                  <button className="bg-white hover:bg-neutral-100 text-red-500 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all border border-red-500">
                    View Details
                  </button>
                </div>
                
                <div className="flex mt-8 justify-center md:justify-start space-x-2">
                  {heroBooks.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full NPR{currentSlide === index ? 'bg-red-500' : 'bg-neutral-300'}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="relative order-1 md:order-2 flex justify-center items-center">
                <div className="hidden md:block absolute -top-6 -right-6 bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-lg transform rotate-12">
                  {heroBooks[currentSlide].discount}
                </div>
                <div className="relative w-64 h-80 md:w-72 md:h-96 shadow-2xl rounded-lg overflow-hidden transform transition-transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <img 
                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxQTEhUTExMWFRUXGB0aGBgYGBYYHRsgGh8bHRgYHRgaHSggGB4oGxoYITEhJSorLi4uGB8zODMtNygtLisBCgoKDg0OGxAQGi0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIARMAtwMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAEAAECAwUGB//EAEgQAAIBAwMCBAMFBQYDBgUFAAECEQADIQQSMQVBEyJRYQZxgTKRobHwFCNCUsEHM2LR4fEVJII0Q1NykrNjlKKy0hdUZIOE/8QAGgEAAgMBAQAAAAAAAAAAAAAAAQIAAwQFBv/EAC0RAAICAQQCAQMDAwUAAAAAAAABAhEDBBIhMRNBUQUiYYGR8HHR4RQyQqGx/9oADAMBAAIRAxEAPwDuNtN4dGeHS8KuDvO7vBNlPtorw6XhUHMm4FKUttE+FTG3S7ybgfbSC1ebdLw6bcTcVFKbZV5BPPbFNtoOXJEynZS2Vftpbam4llHh0gKt20ooWSyo0hVkUttSw2VRSq2KYihZLK2pqsIqJFSwpkDTPUzVbNUsZFTUqjcuRSpkOkze20wWrYpRSGCyrbTbao6j1K3ZKB95NwkIEtvcY7RJwgJgDvSsdTtPbe6reRA2+VZWTaJYMjAMpAzBHcU2yVXQPIrovIpFaD0PWLd1gqLeBYSC9i8ixE/bdQox70RpNUl1dyGRuZDgiGRijrBzIZSKEoSXLRFkTJ7abbTabUJcBKMGAZkJH8yHaw+YYEUP/wAStbC+7yi74JMH7ZuC1tGM/vGCzxz6VNsuqDvXyE7aaKY3l8Twp8+3fEH7M7ZnjmqOo9Rt2QpubvO2xQqNcJaCYCqCThSaGyTdDb1VhG2ltoPQ9Ws3W8NWZbkE+HcS5aYgcsFuAFgO5E1HU9YtW7htEXWuKqsVt2b12A+7aSUUgTtb7qZYp3VA8kfkNCimK0Jq+r2kS3cfeBdMIBauFiSC23wwu5TtVjBGIq3Qa+3eBNtp2mGUqyMhiYZGAZTBByM1NkquiKavstK1EiqOm9Rtai2Ltlt6EsJgjKmCCDkH+hB70zdQti8un3fvWQ3AkH7IMFieBnsfSpsknVDb1Vl4FIrWbe69ZV3T96zW22vssXrgBgNG5FInayn60Te6hbS5atM225eDeGDPm2wSJ7GCMd80fHJeg718l5FRYVXqNSqG2GMG42xMTLBWeMceVWMn0rP13X7NokP4oghSRYvFZJAADBIaWIAg5moscn0ht6XbD2eKpuXaFs9QS5O0OI5327lvn0DgTx2qNy6Pwq6OFvg0Qju5Q1+5TUOzTSrSsFdmlRO1pEU00prAonHMXriXDqdELLKrzfy6lxHh58oZTP1oG2GW31S3dh7wQvcuICEbfZItgKf7sqluCpLHIMndW51Dp1q/t8VA+0krlhtJEEgqQeMU+n0Fq3bNpLarbadygQG3YYnuSRyTmr1NKKX87soeOTlZR0i1qgqG9ctNb8NYCWnRpgQSzXGBET29Ky9Zq2017Uon29QFu6YczdcrYuY9FY2bjezMfetTRdE09pg9u0FYYB3OYkREFiOMUTe0tt3t3GQM9ok22PKFgVYj5gxU3R3XXH8aD43VHOll6abi2wSlyzvtD+bUWgtsr/5roNk+5Rz60R1LQ+BorNmZKXtGGb+Zv2myXc+7MWb61sarSpc2b1D+G4uJI+y6yFYe4BP309+0riHG4blaD6owZD9GVT9Knk6f7hWJ8/8AQKV/57//ACn/AN0VR1xf32h9f2k/+zeorWdJs3iGu2w7KIBlgYJkiVIxOYqFzpFhra2mtg20O5FJbynOQZmfMe/egtvD/A22VNA3xTkWEH9+dRZayP4htdTeYdwgseKG7QY7ihdmoPUNV+z3LafuNNu8S29yc6mI2usd5ma1tH0yxZJNm0ilhBePMR6FjLEfM1TrujWLr+JctBnIClpcEgTtB2sOJP3mnUox4/noV42+QP4j8Tfoduw3P2n+MlVJ8C/JkAkDmMHtS+H3Z31F27C6g7Ld20OLS2w5tAGf3gbezC5wZgAbSBpLobcWwEEWjNvk7DBWQSedrMM+tSOnUuLm0bwuzd32kyVPqJzB4oKS27f52P43us5ToGoXS2NPfdgli9YTxW7Jdtp5HOMb7alJPe3bHJorRWnF+xcuDbdvi9cdTyg22xbtf9CQpj+Lce9bTaK2LYtbF8Jdu1IwNhBWPkQCPlUdTtLByJZQQD6bo3ffA+6neS7/ADf+Bo4XZidLTUG9rTauWlT9ryHtu7E+Dp5hlcAYjtV3VdOl3VWbbiVaxfnMEEPZKspGVZSAQwyCJparpNh2Z2tAsxljLiTAEmCMwAPoKJIXcrwNyqVU9wrQWUex2r9wo2t1otWB1TMzWa9/H0Vi+d15b5ZXiBeQafUDxBAgMCQHXsSDwwq74svE2BP/AI+n/C9biib7qSpKglG3KTypIKkj0O0kfWqtUysAGAIBVgD6qQyn6MAfpTpOUk6LIadpNfPRK+5LGgNSx4mrL2owST+MVg3eoMWkH5Ct+k0zfJdmzxxLkNvXo7xSrA1WoknNPXWjplXJyZ/UHu4PXy1Ra6BVHjzVFxq8ooGxQDg9SBoBXIMVel2o4EcQiaQNRUg8nFOBS7RR6VMKW2ptIIUzUopbalEGFMakRUam0IwpE0poS/f7UaGUbY9y9FAXbtU6nUgcmfxoO7rF9e8Vox4ZPpGmMUuw+5dnvMYH+VB3tYokE8c+3+dZut6ntwv1/wB6ygzFoUFjyAAWJ9vWujg0Nq5lGXVRxuo8mo/Wc4HFVavqZMAQMjjPvH5UEdJfjzWroVZObbACYnJHyoe6wxBxyf8Aat8NPiT4ME9dkaaJ6rWHOZ7Tn1wfuoDxD65qTHsaqmtkYpdHPyZJS7YxpU7XARxmZmeBmRt+cZ9qVOU2evG3UfD9aTalRGZmYjPH6io3daoAPIP09u/5V4yn8HpKZalurtgrPudRQESCD98x6DvTp1ZCYHMfT5ex9qaOOT9AaZoqBUmgcmKxNVqmMxIjgifQH6d+/b6UO+tlxaJwPf7ODEzyIkZPbtzV+PTSkiucoxa3M3f2y3MbjP8AlE/nQ1zqi9gIjkn14OO3esTxgwKk+sAYDHssHvPPb8qhc1SkDfB2tmM4AwRj1OcY2x2itsdFGjHLVxizSu9fBHlKhidvEZ9fljn1qsdbOJYAjB9iDDE/QA/rHI6nVhiJGAST2JkMJniJj6gfOmua8AqxUwQu5hjdBXJA44b8Pq7+npLofHrISfo7m51XAIAg/ePnnHH4imXqoiSMYiPf1/CuRfqs29s7omIJEgqQYGMw0xxg1Wt7uMQkmDgggYIHYZHrkek1mWhfb4NqnjfCOsfrAKyqnjHecEyPyrKv6xnO4Hbt7RMg4B+c5+lZ2nuOCquCCoIYY+0Qc8xxE5qka0bZDZKiQfUYkf61bDSJPhDeWEVZcb3kGc9hP+IkGfmCDQjyxhASYEAZ45wOfWq21XK+sdhIjsD/AAj2ovoenGou27RQBV3PdYEyyDhCOAN0LPoxrdtWOLk+kYcmdy4RodH+HRdAu3S3hnKIDBuD+YkGVT0jJjt37HQacAbUUIg7INs/dz86B6rrDbtPdgMVAxwuSFBJ/hQTJP8AKpqd7rXgG6l1SwtLvL2wIjY1xwys0hgqsYEyCvrXCzZsud2+vSDUcffZrtaHqQfUE1h9X6PavyLqQ3a4kK49DPDj2afpV2p+IALbMqOGi5sLbCs2w2WC3CwUsjCY7HioXOqbriqVK7vKJAw6iWBYMVgqylQPMfNjFVQWSD3R4BuhL7Wec9c6Y+ncW3AOCVuCYuCeYJ8rCQCvbHMyc1/SvUPiDpg1Fh7cecee0fR1GB/1CVPzryxTImvSaDU+fHz2u/7nP1GLxyr0I0qQpV0DOdr1TWDzqGJ2sCoBjbt27h7TkVa+qDSPVDyTkfwx6ST2/lFctvKg8w3qIBEyGIHJgTGfrU01RJkEE7dpbg8HOfQzEcyK5r0ao3r6lzyjobWq2+aQRt+fpn23Absdzg1P9rAO+MMQCD2IAj5zumfVSeOcLS9QYBgoAkFQILYyACODzyeM0Hb1bhjuUqO4UY7DA4kA/iKZaXkSWub6R0qa7lC0sVUD3wJIafLHPciBQQuks2AC3mM4YzOZ4HPpxS02nLk3diqqidomB7gEzB57nJo3T2ATFsFQ8nP2owQr9pxP3HtRjjjDox5tRPL36My5c2MrK+4NuAEjf6Sy/wAMySCfQx72at4UqH3RtJPpPIXHEj5kT8qOfT7YDyy4AX3HbHJg4M+2ate9b3NwmQeweAONvDepGIJqxMo/Bz62igO4nb9f/THYgEe1QLFgFBIXG8ROJ+0VGWgkmfSKl1XUncBHADKFBgTmCTk80KgmSTJGfWZ7ccwe+MfSrfyaIJvsiRB9Mx/TnvVmnukEgekf6fdUVtepj7/u+ZrR13TjYZUcQSAZnsQDwOInnv8ASkk0a4WvYKQRhZUD07QI9Ow/1mj9fqrbi0lqyLTW12uZkuRyzL6iCe/PtQd32OKouKQPsmJgGO45AP1GPlQpMaRKyoLQSF/83H1/Kun+BwN+obEhVH0LEn/7RXLW2Mk9zPaeefzNb/wZqNmoKk/3qFB/5h5l++GH1FUaxOWCSXwNi4kmdD1HqhtXCDt8ILbZ2IbAuNcVpIP+AQNpkmMc1LqHVtOoaE2vp9rbSi7FfUALZLhT5w29R5TiTPFHeCu4PtUsP4oE+2efX8aJ1dlVtSllGIHlXZI88BhAHB7+3yrzcZR44NWaMu7BLeqt3DYVLdv96LsM6AgeHG9QozuLMTtJBhXJE0Hf6mFt3d1u2Lts4ZFGyWAAzO4jdgnHlj6GFnYbX0ibSysVK7gCDbBbiNyhnz38ORgii9dpreP3aEyTO1Z7SeOcL/6R6Uzkl2ivHFt8AvTdVvzBVlZQymMEhWEEEggqwP1zmvJtem27dA4F1wPoxH5RXrLXksI1yAqW1LkAAcZiB6mB7k15BJYknkkk/MmT+JrrfSFzOXrgq1nNIY0qc01dqzFQbrbQHG4D05j1An7IEse/b1qBMiPTMfMCM4kd6M1lwSQYMEDseI79vn6elCMcHyz6EdpjBntg8Qc84pUzOkSGoOCJ3cTgYGMdvTnt6yaVhgWE8AbpJj5n74FOLSwSCJiG5HOIwPN7+vrV+r0qlB9lTtke45BMck8AffUtBSNu0PKWJYN4YaCDBn7M48qlZz7HvRnSNKzAO/iKuMsZY788kAbMmJ9TmsjpNp9gKTB8zAgNmBJgGSMCCRGTiZpWuo3kO0PhSYO6Inn7OYESBWdp9JhUG+jR19/ZABBRSZkZc9veOR8hWP1BfEbcuW+0WJBLHEk/Wce+ZplUODuwY8uCZyJAn7PrP+dTDnAPb0/KpdGzDpG+WZSK0zn51d4ZjijHGY/LinVDj6gfrtzReQ1LTqJT4ZAzzzmm1t9mILAyEUcGSAPKW94jPpFXXBVGxvMQ22RtIBILKeRHdcCfpUTBPG/Q9m6AfMN4HaYHtn2PaoXjuYkHEmJEfUgTBPfPJpmED5CmDyBPYc+tNZXs55HUU5eOJDAgqQeCMg/PiKjNQY1Ox30eh9A6yupXsLwHnTif/iJ6qe47H6E7uku42nntXj9y4Z3gw0yCvlIPqI+z9K3dN8X30EOEve7Aq2PVlwfmRXH1H0xt3i/Ysjm4qR6ZNAXnLNjgfl6n0rin+PLhEfs6/W6xH3BR+dZPUusX9Qu244CHm2g2qf8Azcl/qTVEPpmVv7qSGWZf8eQr406+LsWLJm0CGd+10/wbfW2OZ/iIBGAJ5pJou1YA+f6zSW3Bru4YQxQUImZwlJ3IrtaeaVFUqbcx/FFFfhET7/h6D9elQZcEZg/PMf60feQ8H7/xqorPz+ufc0vkFWlKrAG7zDH+HHHYAYHzoxOOwgbhnmYBx64qnOAYwSeB3iZ/m471O231xHy+XpSuaLVp2uDQfVwCmQCAD9PYdv8AWoWdUT5YUnkSD9BjPc44oJZJx/v7U+/MxB/L0+VLaG/0yXSLbyAGAZ9xx9364qAhsDknEkfd857zUVUtMZgEt8hyfp/WoIOeIjv7ZgEdz/WhZoUWkSVv96ct+vnVRP6/OoFvej2Rugp7uBx9OTPrVLPVTNPapcSAZHAJHaeYPFNRW5DXGFMjHBByOPbvTTHzBwfQg+3NU7qco9ltwRVbXKRaeaG1BgUULPhEjcnP3H5c/mKmlyPcY3CYkDkT2ovrljTWNVZss5s2rmmtXWuE7gGcOTzwCVXA9TAzQznRshB1yLuUlW2E5AlQwkxyFgZmSMbWI8saM932AnqltCv8SsJlckentB+YI96K6b1FbmJ80mBBiB6HM+prJ6l07TqruvUFvlV8iBGDbtwBALH7Mbjj0HzOXpNayYRznlZMYMyVkA/IzM0u9MaGVxf4O4pgROZjvHP0ms7RdSV7YbdJAG7EZ74pn6ku6Bn3/P8ApTqJollj8hWq1IUSfuFKs7qD7lAwQTOY+nPFKn2maWR3wzpguQJ3T2GM5xPfMcc0ikjA7Z+nJPz9B7VcbfMgieBAER+iMVYl5gjoANrQWMZMHyyfSfxrl7zuvG/SAAtMVzJogJThKR5S5YQcJ6fOnAonZ7/nmktvgAZ/y9PpS+YZYEUm1iQvBz6CeB8sGPrTFQJHP9M8+h4/GiCn31Epmh5x1g4KDb+7tVZT0xRW2kbdFagD0yAxbqXhj/L8Zmr9lMAeOBzn8DViz2Uy06B7o/Xy4/CqrxEkgBRkwCYHtJzVfVtctpSTDNGFkA5mD+H4Vy79XN17a3mKWlOWtDzwCYciRubI9MAYnm+E3Lk5+pnjxOu2dO3H5fWs3r14Lacg84BIEgepE/1++sbpfUmtnZI2kgSxMDOW9vlwK1fiFoDKBcJCyYMIR3kkSSBny/hVu6jM5qeNyRufEt5V6t00uLZVtNpFcXFVk2sWDyGxwee1WarRaDVXEW6yWCLVt3u2nREbfqHtmz4QXajQQd/IiSIFU/EyM3VenhHW2x0WnCu6eIE8t3zbBlmA+z/i28VpdW6zaQvbOo067Vupdt3ZZr7tatJpL10G352DLvuGBt83Iycjk1VGU4n4x6bYsXwmnMrsUuu8XPDc7oUOCSQVUNBkiecisLdXoPxL1BbljVWU1VrVMbNk+IhlrhS/vuM8KFtIiuwUE+VOT2HnxIidw43c5iYyOx9vSDwa0Y5NrkBZbvESJORB/pRD6o4PYfqJ7UK4IMd/bP0/2qIb8KtUmgUHC8Np80Z/DsfT6dqVZt65jmJpVHlZKPXoxzUigJMSBPGCY+fc1IJ+v1+sVaox7/rgetcTynsPGULbqXg4q9kjnn9fqakOKqc2WJUDeHT7atJqMVU5ssSKyJpitTaqrt4KCWIAHJOAPme1LuY3CEVptorLTrA8V0uTbAgKGRhkYYs2R9rygT9JrUP3UZRlF8i4ssMquLKtZeS0m9zgROOJO0Z+ZH31LUEKpMrgfxNA9I3Zj04MelcX8aanfcZCGHhgFcjb23E5k4McHPpmZPqrjaRbYCgsVULuAmY2qQ4OTIIzHfEGdsdPJxizlZPqUVOca6XD/Jj9W1rXXYn+CQTPMmJPtPp2jPoMbTMm7DS+2Nw3TEzs52mY3euKjcbEuNzEQM8RKmQPb6ZzNOIUqQ4fEjBEGMg7oyJOeDGK6aVI87KTlJtk9IkuASoMxLGFn3iccCtDrv8A2fzIyMvl5ETklY2yBGftfy81ksZyYJERwBA5B/m7D5TVmq1LPZCchATIliTEZk+XHtzUauqGhOk0z0bqF3b1vpZgn/lLGAJObd4cDnn86u6jrtOLt9Llo7rdtW1Ctpww1NtbKW7a2Hdi1hAwBHmLEndJyKzPivqqaXqnTtRcBZbeisEqIkytxYG4gHnMmhem/wBoSC0LWoa4R5wTp/DtALNnwfCWV8MoltwOCC05JJqim6Aaej+KOnoW3Wy1tk2paXTeGbNtgAdNcuD++3tB3HHkbI3YmvxR0seHuUXCpkk6YAB4ffejYDtuEr5JYCQIAWaE6j/aPp7i3h4d5y/ibd5VVYXECKt1VulWFsAbSyuTz5Wlj5wt5R/ED7yM08YJ9ksuuXmMs2WJJb5nJwMAT2FVWSBumeDERz257TyOaW+eDPrBq7SaO7cDG3bZwgLOQCQoAJJJ4GBP0q2wFAb1/rSqrd3xFKlsJ7gD+vwp1H6/X6zUYjHf3x+sfnU0bn5VwmezTtCmp2is5mPbn259/wCtQEUlf8vuoR7sj6omx9vlPP1qDD9ZzUGekM98DsT+VR8sK4ItQPU7yqh3OEnuW29jJkEfmPnRzt2rJ6zcIA2u6GGEKgffIjZt2kz9V+foccbmkV6nJtwyZjllNw71Zg6Al2QEkruIAJuYH8ssS2RMgCgOtfExO23b3DYQSwBQyPs4wQByQYk9ooLqTMpUrCgA7WUBTcHBLx9tswSJ4OZFZwtFpiIg+8Y/pXXhp4vl8nlpayaTguAi1r1OL1sRDEMg2v4hA23if4wCJ2SB5jQSBIjaSCOJgg+/YyP6ekVbr9IEFsh5LpuZCrIySfKDujdKwwZcQaoAMTmOJj0zFXpVwZ22+WK1c2kETgyPmOD+A+6lcM8AYmfUz39BzwKr+lKaJCQPOP8AT9RT3DIjt6fr6/fSYR37VAioQ7Gz/aNrQiLGlYIoRS9hWbaohQSTmrLH9pGrnzW9HAyR+zoCY5UHME+pFcYAPn+vSpr+poLHH4Cdj/8AqLrSMW9ITkwNKpiBM8+gJPpFVt/aTrf/AA9H/wDLJ/nXK8Rnkcg+sgjHHcR6H3qu6w/r+vrRljj8As0fiX4mvazZ4y2V8OdvhWltTujmMngYrI0ure0S1t2QkEEqSMEEEH1EE496rdpzFQPy/OkqugjqAeSB+NKobvvpVCHu1u5Ajiee89gM/ZxPHqKaSDj/AD/0pywg8T6zzP8AhP5iKgWrnThxyeqhPlkwJ+dBtr18XwiMwCCIaQf4pUnH4icxBouyhbcAwWFLbjMACM4BNZdrpYd28K/ZuuSSVXlo/hRGCoWmccYBjmhixRle4y6zVyxyiofqaTt3iPlVZptPO0Ag4xkgmRzMDyt6jtxVmoTbHHmUMPk3H1qmcaZvx5E0ilyO1ZnXr4t21eW352BFJMxByBIxkiVEATPFS1Pj3Sbent52z4jFdtvmWeWAQREE8+bGKE6naAm0+vspdU4JXUhVaIIN5QFJBnlYGQRzVuHC7s5+t1kNrxq7+TjtXrWczcJZwILHJ9I3H/QDsKl13S20ZTZuB7bKrYDLtYjzWyGJMg9+8z3qHWek37DxeWdw3C4p3o4aYdbokMCZ96dekt4Vi4Xtr+0eIbe5ggXwWht5bEn+GO8Cuqpqjzri7sEtMSGWN7ELBLGV2TgZiCuMzAGIqtFnMiRA25lpngxGPf1HoYi6kMRIPqVMg98EYIov9muLp01IZdly49oD+L92qliewEXIxR3Jdk5AiYwe31q0mEK7iCWWVGUYAEhi0/aUmAI4Y55of6Y9a3+mfDZu6S9qjdW2lpXKrtZ3u+Ht37QOEBuIC+YLUHJLsamYoP0/rTYznP6xVlplgMRJBEq32SIngZOQQc9xRfQel/tJu/vLdpbVvxWe5u2gBlX+EE8sOKjaStkXJnqe36/XNS/U+lbln4Xa5I02r0upeCfCtu63GAydi3FAcwJgGcViXrxIBY/YWBgDCzAOBJ7ZzUjNS6C1RE49qg7QfftXR6z4VFshb2v0tptqsVYXpAdQygwkTBoW98KXirXNPdsatVEsNO+51H8zWmAePcA0jyxfsO1mEoYhtoJAG5vYDBPsJI/CqXmpspAU5AYSD6gEg/8A1A/dUaIBiv1pUzGnoBPbt4pbpHy7eg+v5VlP1NVdQ3lRlkOSIbME4MkYzHG0yBFFrcDAFe4nPvMEe0dvY1nlBrtHcx6iE3UXYTkpqFQSzae7tTJJMCIHcTj61zej01y7dW3ZVwAfM5BVFCndv3n7CrA9zwPY/QO1u5qbm9hcXR3iIYnZG0qVM/0xireldSe+rWNTeJWZS4zE7HMjbcU4uWzHf7LQR7PBOMXRxtVk8ubnj1+wuqdQN25dNoMFa4xW4Z2GT5SII2KTuM9z9afq2vNtLKkuAdJZlgQ8yIMqp3tnMrHPJoX4i3L5Lgbcp2srEBcR52K8gmIOOPehPillA0ztsYHR2It7mgYPn54ggdzjvGIscXtLnmlF0n0N15lsaazpbYVWvWxqb4K7WJP93JJ2jaFwsmCSeYnm+q6trzSzNcbgEySd3qJImcQO9bnUVa9pLOoRVLaa2LF9dsm2iljZvKp/7tlYqW4lB865Z70Z3AD+b+s+tW4YpR5MeSTbKyz7Ast4asdoM7VJgsAOB2kCuludD1Gp6f082LL3Av7SGKx5d13E59jWFqNPcW2jXEZbd3e9oHAO3aGuBeY4G7vBA4o/qyk6Dp0TxquDHF4UJ87dpI8XZE/BnUP/ANnd/wDp/wDyq/r/AE27pum6W3ettbf9qvttaJgpZg/ga58sRmTHzNbOvz0vTASf+bv8+vh2Z+k0JKVq37Gi07MnS6drjLbSC7sq21z52dgqgHjk9/eul1XW002usrb8+l0i/szAcXVaV1TkdyzM7f8AStU/BpWwt7X3J22R4VhQwQteuqfsMQwDJa3MJU5K0CNZ0+I/Y9VxH/a7f4fuKEnul1wFFHxF046bUXLGCEPkfnfbYBrT+8oQZ9ZrQ+FLzldeVJLjRllIHmnxrEHHeQIq/rb2tVord+yjo2iK2Li3HFxzack2HLKqAhX3W+OIyaG+CtS1odQuW2KsmiYowMEfvbMEHtQcm8b+SJJSBvhrpN+7qLRRHti263Ll5wVS0qsGNws0BcAnnJwKH65q7V/V6hw2yzdv3HBgmEZiQ23B4M7fetvQ9afX2v2LWaht5O7T3nZtocx+6vCYZGIG1iJQn0MVyvUNO1o3LN22yXUO1w38JAyI+cZGI9Zoxb3Pd2R9cG//AGhMf205InT6eR//AFJXO6fUPauLdtsUuIZV1MEEdwa3/wC0U/8AO8/9xY/9pKx+i9Nuam54Vm14rsPUgW+JuMwwoAmd2M/KhFrYrI+zW+OLCtcs6lECDV2FvsqiFFySt3aOwLKW/wCqub210XxhrLb3bdqw2+1prK2FcfZcrJuXB6AuWj2isNjTY19qsjB2EUqtue1NTUQ6lBBlo/wjH3yePcVo9P6ibIIhYJlid2JBgmPtRnHtxQXTbyyRewI744G5QcGZAIE+oPzH1KsZYBgMEkZGfsyRj6HI9O1apJNGOMpQlceA+31E7nZbuboNl93nAttgkscgiAOJjPtS0mvKFWHmO7vy0RiRn0rOVziYGOwHrMn+aecx/lsHQ6UWbFy9dvobyuwS3atuFCOVMszqec8d6SW2K59hhucr9o0Nd1MXoRiLqptCAI4uBTDFfMP3gMwoIxOOazOo639ocPcRPIFtIphTCghUIBE7SQDGBOalrLKG0dTYvvqLaMquHHhXbDORsZkkhkLDBUgSAPegem6G5qD4dtFa4xJcsQNkQZMnyqPNLHsY5ImuMYdovnlnLh+yGm6ncs3fFS61u4F2h1jAwNpkEFcQQZkCibPX7zBrg02gDqRuu/strcCT9rPlLTmAs8mpNb0Fs5vam+wwz6e3aWzJn7PjGX75gChdV0VTaa9pL/j2kg3UdDbu2RwrPbEh1E/bUke1BuDdtCpSrgzddr7l52a87XGYiWcgkkSBn+ECT5RAzxgUr+tdkt2ZGyyHCAhQQLh3PJ7yc+1GfD+gXVXTZDQzWXa1id9xBuFo/wAoID5HdV5rKfUBtrKNoCrjGT/EfqZOeMDMU323XwHnsg54/X1/GrX17m0lhj+7R2uKIzucKrGeSIVYHtWn0XoT6q3qHt+Uae1uAJBN1xLFFEYm2txoExs96w7TicyR32wDx2kEcxS7k3XwMk0gq9r3azbsE/u7RZkAEea4RuZiPtHAAJ4Aih9ORuJYBgAcEkSYO0eXMz/rWloOmI+jv6i4xQ27iJbIgi47yTajkQBu3e4Ed6foPS7N2zqb1+7dtpp/CnwkW4zeKzKMMygQVHfvSuUUGrAtN1O5Z8UW4C3bRtXFPmBUxODw0jcD2JxVek1d2ytzYQF1Fo22wDKbgSP8J3J88e9a/h9Nx/zOuBAx/wAtYxyR/wB96mgvhvpa6nU2bBfZ4rMGKjcV2qxBEwGJilbjy2g8mYpkEH9f50X1Lqdy+EF5gxtJsVyvnZR9lWYZeBgFuB3rTt6HprkKNbqbZPDXdKhT/q2XSwHvBrO650S9pndboUbGCyrBlbeN6MuZKsnmDR84OKimmyUaF74w1DEb7WkuMFUbn0mndoUAKCxUkwABQ3UPinVXrfgm4Esnm1ZRLKH5rbADfWav0PRrFuxb1OtuXVS6W8GzZVTccKYa4zOQttN2ByTmOKh1HQ6NkFzTal1O5VazqLaowBx4ivbJVlESRAI5zSLZfQ3JkeHC7sRujnPE/d7+1OhDNLHaCTuIWYnMhRHfsMCjPiDpo0upuWBcW8LZA8RR5WkBsCeMxzWcDz69h+jjv91XCi3UqYnvSqEN3UAgjdPmRSRgYgbc5/w88d6utXyo28gg+XeQJkQSo7x684PaqmgAiBlQZIyDz5SOJ7k8yagGke8gY4iPT9d5rQZmXbzO0zAncoif8REY7fhXR67QajUaTQta0929+7vBjats6qTdMAwCBMVyw9Ads8H0E+3Ix9TWz1q4w0nTskE27+BIn96Rkev+dV5G7j+v/g0YqmFro30mn1Q1AFu7qba2bVkkeIRuDPddc7FEQu6JY9hQtq6bfTLjA+bU6nwnPfw7dvxCs+7kE+oWK59xjy/aiWn1Bxn5bfrPtW/0EpesXdE7rbZ7i3dO7YRboBQ22bsHSVniYpJKufzbHi1dGAbmeB8p5xjPP+1HfC/UDZ1mndcjxFR1IwyXCEuIR3BUn6xQ+r0t3T3Al+0yMpEo4YT7Ajke6nvWz0HpjacprdYpt2bDbrVt/K1+6p3Jbtqc7PEhmaNoAPNCclt7BCL3APV9fdsdRuXd+59PqDDYEi20KsKByi7fvqHxjols6y6UzZuRftZ5t3hvERwASV/6aytRdLs1xzNx3ZmjiWMk/Uk49BXYdE6emt0+luXD5NE729UcE/s43X7c+0i5bHzFVybhUn/QsSu0B6nqbdPXQWk/vLZXWX19WujyWjOcWMEf/ENZHxd09bGquLb/ALl4u2T2Nu6N6R7CdvzWheu9SOp1F7UQQbrbyGIYgkCVBAA2gyBjgCup+H+mr1GxplcgHR3dl4//AMV910MT6KyXE9vEFK/sqX7jd8GX8TA2dNo9HwRbOpvfwzcv5UHvK2tg/wCqi/hHStd0PUkW5btlv2cFrlwW1je5MuxAzxnk4rmuu9VOp1F7UHHi3C0fyqT5F+ihR9K2OgWyendSCgt5tLAAJn94/YfWh1Ai7K9X8OMiM51WiYKJITV2ncx2VQZY+gFW/wBngP8AxLSn1ZvxRqwBprn/AIT/APob/Kui/s7ug9Q0qgA+cnd3EW7mB7Gc4/hHHd5P7HyRVZTY+BdcP7zT+CkQbt50t20/xM5PAHbn0of4y1iXbyCyS1qxZtadLhBHieEsM8dgTMD0iq/hvq/7OWW7b8XT3hF6ycbl7Op/huKcq1L4i6KdOUuW38XTXgTZvfzAcqw/huLwy+1Ir3fd+hP6Gpo72n1ums6e7eXS6jThktXLk+DdRiWCOw/umBJhjgg5zWH1fod/SXAmoTZuyjSGRxjzI6+Vhxwe+abqXRL9m3bushNm4oZLqSyGRO0sPssOCpggitzpRcdI1Y1EiwWtnSh//G3ec2p7eHu3RiPelva7QTlSe3am+dR3+9ImtFgJEgUqQbjFKpYDfW8Qy7MNwpBzJ7+0zEeketVXRAA7gwfaO0es8j2pw4naxIB5jJ+6R+YqLAxvhRnbEwZ5kj07TV5notxBBzAwZHsfsxkfhyalq7lzau5y1vzi3LTA3S3lJJTzQY5M96H5BO0QsAmYImRxPmzyagBLhRliwgnykk4iSYGfWpYaJL3jB7/nNV+IYIBweRHyx704cbGWBIaZ7wMbPSO/0pF4EAgjB3bSCGjKz6A/QxNKFGjo/ifWWlCW9ZdVRwpYOF9hvnaPYYoHU6m5fueJec3nJ2y9xmb2yT5RPpge1DKwBkhTiIMkZkSSO4OR7iqS4GD/AEpNsU+hm2TuqVYqYPIMQeOc949sU9jW3EW4iOypcAFxQYDhTIDDuJz9aruMCScD0AwBx27CJ/CmDUGrGQ0fr9frFEaDqtyzu8Jiu8bXH8Lqcm268Mpj9SaHufX2qsiIyOJx29j7/wClBhREH1/X64orpnV7+n3HT3rlndAY23Zd0TExzyfvoUjn0nnt8qlqtQ9wjdkqoUYAO1RCjHMDvzSNWFG2PjHXFP8Atmq3lvtftFziPs7Z9czWLotS9t1e2xRl4ZTBGCMHtiRVSj2n75xzj0qy40mT7DkY9BjtFRRSITdmMZJgACTMDsB7ZP31I6y4LZsi4wtFg5SfLuGA+3gGMTVTCBH6+VNbK7gHnb32xP0nHpTMgb0r4h1OmJ/Z79y0G+0qnyk+pQ+U/OKH6x1fUalt+ovPdIwNxkAf4Rwo+VAEH0pMD3qlpBtjqKtiaZGhSNomRB7iJkfXH3Uj85x+hTxZB8j1j1pU4c8SfXvFKnIbLOQTPrn1mm28yD+AJE9sfr6UrYk59P18vnTMpwSTEmCf16EVcZ0w7/iIYybS7jiV47AABgeFAUduTFPd1oBO+0JJByBwDgEFZPrIj3kYrPtkKw9Bx+YPrRfWOpXNTcN28264YBOBMAAcYOBQ2RofySsoTVfumQINzAhn8swWnAic8H02iIzW5a+LW2Kl20uoQLaGy65YRZWGI3AwXO4yIyUHmAg8yR65n/aD6f7VF1IJB570riibmdFo/i7wxcH7OpFy4z7NwW0y3AilLloLFzaE8hEBS7mO1Pp+v29q7en2SLUs8BWhBcUwd6E/YCWyzEk8yCTXMn9f7VUT6Y+sY7/TNJtQU2dSPi60Vg6C00Rt3FIEOz9rYLCSvcTBmRCgPqPU7Vx7bW7A8qww2218Rti77jIgOzzLO0EqFGIJY1gkCRS3QePlUUUNZqXeohZHgIMQP4o7qZIMn85k0PqeqKy7RYRTiT9ZI4xPePpigGM/rmoMP1/rSuKG3M073UweLYVfPjy/xqFn7MSIx/nmpXerSQ3hKG8QPOBOQwGAI7Ce4JrLbHf/AE9qixobUHczTbqeJKDc6wxB5gnbjmeBk5gVYeqJk+Cpksc7eWaYwvERjttxyRWQ6YHmBkSRnGSIMjOIOPX501Daibmaljq5VNhRSJLZ9SZwOFiSMAHPPFI9TXy7bIkFCDgnykGOM5B/9RGYFZo/pUrdwqZUkGcEGIgyD7UXFE3MLvdUBCxbXcGDM2JMcjjEkbj7k9sVb/xkEkm2NxLSRtP2p/mUnAOP0Kyxa80TGYk8D3J9KrcQSJmkcUTczV/4osf3K5mZg8nsSJz6/dHFZqioTT26kVTI3ZOaVQmnqywG07Ebvp+QqLjP0P5ClSrQygdOKdxP401KoGI1zAqm4eP16UqVKyELrYqnuKVKgOOv9YpXlhUPqpJ9/Mw/KlSpSFLUzdvlSpUoUTttEn2+f4Gi/iPTrb1N22ghFMAZMYHc5pUqZ/7QLsBtDzKO0ioGnpUg3sl6VJu9KlUIVFjESYnijuhWVfU2EYAqzqCD3BORSpVF2gS6ZnGnpUqrQw9KlSpyH//Z" 
                    alt={heroBooks[currentSlide].title} 
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white py-8 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="h-5 w-5 text-red-500" />
              <span className="text-neutral-700">Free shipping on orders over NPR35</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Phone className="h-5 w-5 text-red-500" />
              <span className="text-neutral-700">24/7 Customer Support</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-neutral-700">30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
      <div className="container mx-auto px-4 relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-1">Genres</h2>
            <p className="text-neutral-600">Browse Our Extensive Collection of Books Across Different Genres.</p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={scrollLeft}
              className="bg-white hover:bg-neutral-100 p-2 rounded-full border border-neutral-200 shadow-sm transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={scrollRight}
              className="bg-white hover:bg-neutral-100 p-2 rounded-full border border-neutral-200 shadow-sm transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div 
          id="genres-container"
          className="flex space-x-6 overflow-x-auto scrollbar-hide py-4 pb-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {genres.map((genre) => (
            <div key={genre.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mb-3 group-hover:shadow-md transition-shadow" style={{ backgroundColor: genre.iconBg }}>
                <div className="text-4xl" style={{ color: genre.iconColor }}>
                  {genre.icon}
                </div>
              </div>
              <span className="text-center text-sm font-medium whitespace-normal max-w-[120px]">{genre.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* Best Selling Books Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Best Selling Books</h2>
            <a href="#" className="text-red-500 hover:text-red-600 font-medium flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {bestsellers.map((book) => (
              <div key={book.id} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="relative">
                    <img 
                      src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1602190253l/52578297.jpg" 
                      alt={book.title} 
                      className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors">
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(book.rating)}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-1 group-hover:text-red-500 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-2">{book.author}</p>
                    <p className="font-medium text-lg">{book.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Book */}
      <section className="bg-gradient-to-r from-pink-500 to-pink-500 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 bg-yellow-400 text-neutral-800 px-4 py-2 rounded-full font-bold shadow-lg transform -rotate-12">
                  FEATURED
                </div>
                <img 
                  src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1671865608i/74045390.jpg" 
                  alt="Featured Book" 
                  className="object-cover rounded-lg shadow-2xl w-64 h-96"
                />
              </div>
            </div>
            
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-4">The Fine Print</h2>
              <div className="flex items-center space-x-1 mb-4">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-2">5.0 (128 reviews)</span>
              </div>
              <p className="text-xl mb-4">By Lauren Asher</p>
              <p className="mb-6 text-white/90">
                Rowan Kane, heir to a publishing empire, presents Zahra with an impossible choice: 
                sign a contract to be his wife or risk her family business. Filled with wit, heart, 
                and scorching tension, this enemies-to-lovers romance will keep you turning pages.
              </p>
              
              <div className="mb-6">
                <span className="text-2xl font-bold">NPR2222.99</span>
                <span className="text-lg line-through ml-2 text-white/70">NPR332.99</span>
                <span className="ml-2 bg-white text-red-500 px-2 py-1 rounded text-sm font-bold">30% OFF</span>
              </div>
              
              <button className="bg-white text-red-500 hover:bg-neutral-100 px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                Add to Cart
              </button>
            </div>
          </div>3
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <a href="#" className="text-red-500 hover:text-red-600 font-medium flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {newArrivals.map((book) => (
              <div key={book.id} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="relative">
                    <img 
                      src="data:image/jpeg;base64,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" 
                      alt={book.title} 
                      className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 text-xs font-bold">
                      NEW
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors">
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(book.rating)}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-1 group-hover:text-red-500 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-2">{book.author}</p>
                    <p className="font-medium text-lg">{book.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Authors Section */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Authors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {authors.map((author) => (
              <div key={author.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group">
                <div className="relative">
                  <img 
                    src="https://cdn.britannica.com/20/217720-050-857D712B/American-novelist-Stephen-King-2004.jpg" 
                    alt={author.name} 
                    className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="font-bold text-xl mb-1">{author.name}</h3>
                    <p className="text-sm">{author.genre}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-neutral-600 mb-4">{author.books} Published Books</p>
                  <button className="w-full bg-neutral-100 hover:bg-red-500 hover:text-white font-medium py-2 rounded-full transition-colors">
                    View Author
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-neutral-600 mb-8">
              Subscribe to our newsletter and be the first to know about new book releases, author signings, and exclusive deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-full border border-neutral-300 focus:outline-none focus:border-red-500 flex-grow max-w-md"
              />
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-2xl font-bold mb-6">
                <span className="text-red-500">K</span>indel
                <span className="text-red-500">V</span>erse
              </div>
              <p className="text-neutral-400 mb-6">
                Your premier destination for the latest books, exclusive author content, and literary community.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-neutral-800 hover:bg-red-500 p-2 rounded-full transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-neutral-800 hover:bg-red-500 p-2 rounded-full transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-neutral-800 hover:bg-red-500 p-2 rounded-full transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">Shop</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">New Releases</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Best Sellers</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Fiction</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Non-Fiction</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Children's Books</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">About</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Authors</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-neutral-400">Kamal Margh , Kathmandu </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-neutral-400">+977 9889213122</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-neutral-400">hello@kindelverse.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-8 text-center">
            <p className="text-neutral-400">&copy; 2025 KindelVerse. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Shipping Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}