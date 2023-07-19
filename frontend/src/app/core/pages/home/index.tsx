import { Flex } from '@chakra-ui/react'
import React, {useEffect} from 'react'

import { Sidebar } from 'components/organisms/sidebar'
import { HomeTemplate } from 'components/templates/home'
import { useAssets } from "hooks/useAssets";

export const Home: React.FC = () => {
    const {
        loading,
        getAssets,
        assets
    } = useAssets()

    useEffect(() => {
        getAssets()
    }, [getAssets])
    return (
        <Flex>
          <Sidebar>
            <HomeTemplate loading={loading} assets={assets} />
          </Sidebar>
        </Flex>
        )
}
