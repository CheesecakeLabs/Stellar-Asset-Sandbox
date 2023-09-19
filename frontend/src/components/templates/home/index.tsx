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

import Authentication from 'app/auth/services/auth'

interface IHomeTemplate {
  loading: boolean
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  userPermissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
}

export const HomeTemplate: React.FC<IHomeTemplate> = () => {
  const [slider, setSlider] = React.useState<Slider | null>(null)

  const cards = ['forge-asset.mp4', 'forge-asset.mp4', 'forge-asset.mp4']

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW={MAX_PAGE_WIDTH} alignSelf="center" flexDir="column" w="full">
        <Flex mb="1.5rem" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="400">
            {`Welcome,  ${Authentication.getUser()?.name}`}
          </Text>
        </Flex>

        <Flex alignItems="center" w="full" justifyContent="center">
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
          <IconButton
            onClick={(): void => slider?.slickPrev()}
            aria-label={'Previous'}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box height={'400px'} width={'900px'}>
            <Slider {...settings} ref={(slider): void => setSlider(slider)}>
              {cards.map(url => (
                <Box w="full">
                  <ReactPlayer playing url={url} width="900px" height="480px" />

                  <Container variant="primary" mt="1rem" w="full" maxW="full">
                    <Text fontWeight="bold" mb="0.25rem">
                      Tokens
                    </Text>
                    <Text fontSize="sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </Text>
                    <Button variant="secondary" w="full" mt="1rem">
                      Forge a token
                    </Button>
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
