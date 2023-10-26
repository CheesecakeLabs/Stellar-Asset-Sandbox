export const networks = {
  futurenet: {
    name: 'Futurenet',
    passphrase: 'Test SDF Future Network ; October 2022',
    rpc: 'https://rpc-futurenet.stellar.org:443',
    friendbot: 'https://friendbot-futurenet.stellar.org',
    horizon: 'https://horizon-futurenet.stellar.org',
  },
  testnet: {
    name: 'Testnet',
    passphrase:
      'Test SDF Network ; September 2015Test SDF Network ; September 2015',
    rpc: 'https://soroban-testnet.stellar.org:443',
    friendbot: 'https://friendbot.stellar.org',
    horizon: 'https://horizon-testnet.stellar.org',
  },
}

export const SELECTED_NETWORK = networks.testnet

export interface IDemoUser {
  pk: string
  sk: string
}

export const fundAccountWithFriendBot = async (
  pk: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${SELECTED_NETWORK.friendbot}?addr=${encodeURIComponent(pk)}`
    )

    const responseJSON = await response.json()

    return true
  } catch (e) {
    console.error('Error while initializing account with friendbot. ', e)

    return false
  }
}
