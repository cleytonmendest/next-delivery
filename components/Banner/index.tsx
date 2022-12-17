/* eslint-disable @next/next/no-img-element */
import React from 'react'
import styles from './style.module.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper';

const Banner = () => {
    return (
        <div className={styles.container}>
            <Swiper
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false
                }}
                className={styles.swiper}
                modules={[Autoplay]}
            >
                <SwiperSlide>
                    <img
                        style={{width:"100%"}}
                        src="/temp/banner1.png"
                        alt="banner1" />
                </SwiperSlide>
                <SwiperSlide>
                    <img 
                        style={{width:"100%"}}
                        src="/temp/banner2.png"
                        alt="banner2" />
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Banner