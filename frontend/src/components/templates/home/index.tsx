import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import ReactPlayer from 'react-player'
import Slider from 'react-slick'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { ArrowBackIcon, ArrowForwardIcon } from 'components/icons'

import { carouselData } from './carousel-data'

interface IHomeTemplate {
  loading: boolean
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  userPermissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
}

export const HomeTemplate: React.FC<IHomeTemplate> = () => {
  const [slider, setSlider] = React.useState<Slider | null>(null)

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  }

  return (
    <Flex flexDir="column" w="full">
      <Flex
        maxW={MAX_PAGE_WIDTH}
        alignSelf="center"
        flexDir="column"
        w="full"
        pb="4rem"
      >
        <Flex alignItems="center" w="full" justifyContent="center" gap={4}>
          <IconButton
            onClick={(): void => slider?.slickPrev()}
            aria-label={'Previous'}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box height={'400px'} width={'900px'}>
            <Slider {...settings} ref={(slider): void => setSlider(slider)}>
              {carouselData.map(data => (
                <Box w="full">
                  <Container
                    variant="primary"
                    mt="1rem"
                    w="full"
                    maxW="full"
                    display="flex"
                    justifyContent="center"
                  >
                    <ReactPlayer
                      playing
                      loop
                      muted
                      url={data.slide}
                      width="100%"
                      height="480px"
                    />

                    <Text
                      fontWeight="bold"
                      mb="0.25rem"
                      mt="1rem"
                      pt="1rem"
                      borderTop="1px solid"
                      borderColor={'gray.600'}
                      _dark={{ borderColor: 'black.800' }}
                    >
                      {data.title}
                    </Text>
                    {data.children}
                    {data.actionName && (
                      <Flex w="full" justifyContent="flex-end" mt="0.5rem">
                        <Button variant="secondary" mt="1rem">
                          {data.actionName}
                        </Button>
                      </Flex>
                    )}
                  </Container>
                </Box>
              ))}
            </Slider>
          </Box>
          <IconButton
            aria-label="next"
            onClick={(): void => slider?.slickNext()}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Flex>
      </Flex>
    </Flex>
  )
}
