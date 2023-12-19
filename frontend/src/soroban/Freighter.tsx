import {
  isAllowed,
  isConnected,
  getPublicKey,
  signTransaction,
  setAllowed,
  getNetworkDetails,
} from '@stellar/freighter-api'

import { SELECTED_NETWORK, SELECTED_NETWORK as network } from './StellarHelpers'
import { MessagesError } from 'utils/constants/messages-error'

const getUserWallet = async (
  onPublicKeyReceived: (key: string) => void
): Promise<string | undefined> => {
  const authorized = await validateFreighterPermissions(onPublicKeyReceived)

  if (authorized) {
    try {
      const publicKey = await getPublicKey()
      onPublicKeyReceived(publicKey)

      return publicKey
    } catch (e) {
      throw new Error(MessagesError.errorOccurred)
    }
  }
}

async function validateFreighterPermissions(
  onPublicKeyReceived: (key: string) => void
): Promise<boolean> {
  // Validates if Freighter is installed and allowed

  const connected = await isConnected()
  if (!connected) {
    alert("Ooops, seems like you don't have Freighter extension yet!")
    return false
  }

  // REVIEW: From what I have read from the docs, we don't need both isAllowed and setAllowed
  const allowed = await isAllowed()
  if (!allowed) {
    setAllowed().then(() => {
      getUserWallet(onPublicKeyReceived)
    })

    // alert("Please allow  our app to access Freighter.");
    return false
  }

  const networkDetails = await getNetworkDetails()

  if (networkDetails.networkPassphrase !== network.passphrase) {
    alert(`You need to be in ${network.name} to connect to this application.`)
    return false
  }

  return true
}

const signWithFreighter = async (
  tx: string,
  accountToSign?: string,
  networkPassphrase?: string
): Promise<string> => {
  return signTransaction(tx, {
    networkPassphrase: networkPassphrase
      ? networkPassphrase
      : SELECTED_NETWORK.passphrase,
    accountToSign,
  })
}

const verifyConnectedUser = async (
  userPk: string,
  onPublicKeyReceived: (key: string) => void
): Promise<string | undefined> => {
  if ((await getPublicKey()) !== userPk) {
    return getUserWallet(onPublicKeyReceived)
  }
}

export const FREIGHTER = {
  signWithFreighter,
  getUserWallet,
  verifyConnectedUser,
}
