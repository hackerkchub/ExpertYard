import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const BannerSlider = ({ banners }) => {
  if (!banners?.length) return null;

  const handleClick = (banner) => {
    if (!banner.redirect_value) return;

    if (banner.redirect_type === "external") {
      window.open(
        banner.redirect_value,
        "_blank"
      );
      return;
    }

    window.location.href =
      banner.redirect_value;
  };

  return (
    <div className="home-banner-slider">
     <Swiper
  modules={[Autoplay, Pagination]}
  slidesPerView={1}
  spaceBetween={0}
  loop={banners.length > 1}
  autoplay={{
    delay: 4000,
    disableOnInteraction: false,
  }}
  pagination={{
    clickable: true,
  }}
>
        {banners.map(
          (banner) => (
            <SwiperSlide
              key={banner.id}
            >
              <img
                src={
                  banner.image_url
                }
                alt={
                  banner.title
                }
                onClick={() =>
                  handleClick(
                    banner
                  )
                }
              />
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  );
};

export default BannerSlider;