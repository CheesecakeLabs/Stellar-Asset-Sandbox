import { Text, Box } from '@chakra-ui/react'

import VIDEO_ASSET_MANAGEMENT from 'app/core/resources/home-videos/asset-management.mp4'
import VIDEO_DASHBOARDS from 'app/core/resources/home-videos/dashboards.mp4'
import VIDEO_ROLES from 'app/core/resources/home-videos/roles.mp4'
import VIDEO_SOROBAN from 'app/core/resources/home-videos/soroban.mp4'
import VIDEO_TREASURY from 'app/core/resources/home-videos/treasury.mp4'

export const carouselData = [
  {
    title: 'Welcome to the Stellar Asset Issuance Sandbox (Custodial Edition)!',
    slide: 'https://www.youtube.com/embed/F4eFUwpcEYA?si=WQJpVCXhfhR3qVa5',
    actionName: undefined,
    actionDestination: undefined,
    isYoutube: true,
    children: (
      <Box>
        <Text>
          Brought to you by Cheesecake Labs and proudly supported by the Stellar
          Development Foundation, this sandbox is your gateway to
          enterprise-grade asset management. Dive deep into the core
          functionalities of the Stellar network, specifically tailored for
          asset issuance.
        </Text>
        <br />
        <Text>
          Empower your business to explore and experiment with asset issuance
          and management on the Stellar testnet. With our user-friendly
          application, experience the Stellar network like never before.
          Designed as an educational tool, our platform is open and accessible
          to everyone.
        </Text>
      </Box>
    ),
  },
  {
    title: 'Role-based Access and Custody',
    slide: VIDEO_ROLES,
    actionName: undefined,
    actionDestination: undefined,
    children: (
      <Box>
        <Text>
          The Stellar Asset Issuance Sandbox automates the management of all
          accounts and wallets involved in the process of asset creation and
          treasury management. Users register with their email addresses and are
          granted access to specific platform features based on their assigned
          roles and permissions.
        </Text>
        <br />
        <Text>
          <b>Admins</b>: Have the authority to customize permissions and create
          new roles to fit different operational needs.
        </Text>
        <br />
        <Text>
          <b>Default Roles</b>:The platform comes with predefined roles such as
          Asset Manager and Analyst, each with its set of permissions.
        </Text>
        <br />
        <Text>
          This role-based system is designed to demonstrate the various
          operational structures an asset issuance platform can adopt, serving
          as an educational example for enterprise solutions.
        </Text>
      </Box>
    ),
  },
  {
    title: 'Asset Management in the Sandbox',
    slide: VIDEO_ASSET_MANAGEMENT,
    actionName: undefined,
    actionDestination: undefined,
    children: (
      <Box>
        <Text>
          The Stellar Asset Issuance Sandbox provides a comprehensive suite of
          tools for asset management, allowing Asset Managers to tailor tokens
          to specific needs and operational structures:
        </Text>
        <br />
        <Text>
          <b>Token Creation</b>: Design tokens with distinct profiles and
          characteristics, ensuring they align with your business objectives or
          experimental goals.
        </Text>
        <br />
        <Text>
          <b>Supply Management</b>: Adjust the supply of your tokens with ease,
          whether you need to mint new tokens or burn existing ones.
        </Text>
        <br />
        <Text>
          <b>Distribution</b>: Seamlessly distribute tokens to vaults within the
          platform or to external Stellar accounts, facilitating a wide range of
          transactional scenarios.
        </Text>
        <br />
        <Text>
          <b>Access Control</b>: Manage who can access and interact with your
          tokens. Define and enforce permissions, ensuring that only authorized
          entities can perform specific actions.
        </Text>
        <br />
        <Text>
          With these features, the sandbox offers a hands-on experience in
          managing tokens on the Stellar network, demonstrating the flexibility
          and potential of the platform.
        </Text>
      </Box>
    ),
  },
  {
    title: 'Treasury Management in the Sandbox',
    slide: VIDEO_TREASURY,
    actionName: undefined,
    actionDestination: undefined,
    children: (
      <Box>
        <Text>
          The Stellar Asset Issuance Sandbox introduces a robust treasury
          management system, empowering treasurers with the tools they need to
          efficiently handle assets:
        </Text>
        <br />
        <Text>
          <b>Vault Creation</b>: Treasurers can establish vaults, which serve as
          abstract representations of Stellar accounts within the platform.
        </Text>
        <br />
        <Text>
          <b>Token Allocation</b>: Define which tokens a vault can hold,
          ensuring compatibility and alignment with operational needs.
        </Text>
        <br />
        <Text>
          <b>Fund Transfers</b>: Vaults have the capability to send and receive
          funds, facilitating transactions both with other vaults on the
          platform and with external Stellar accounts.
        </Text>
        <br />
        <Text>
          <b>Transaction History</b>: Every transaction made by a vault is
          meticulously recorded. Treasurers can easily track and review the
          history of transactions, ensuring transparency and accountability.
        </Text>
        <br />
        <Text>
          Through these features, the sandbox provides a practical understanding
          of how treasuries can be managed on the Stellar network, showcasing
          the network's adaptability for diverse financial operations.
        </Text>
      </Box>
    ),
  },
  {
    title: 'Dashboards: Insights at Your Fingertips',
    slide: VIDEO_DASHBOARDS,
    actionName: undefined,
    actionDestination: undefined,
    children: (
      <Box>
        <Text>
          The Stellar Asset Issuance Sandbox equips users with comprehensive
          dashboards that illuminate both the overarching activity within the
          platform and the intricate details of individual tokens.
        </Text>
        <br />
        <Text>
          Gain a bird's-eye view with insights into the overall transactions and
          usage of the sandbox. These visual representations capture trends,
          peaks, and patterns in asset transactions, offering a snapshot of the
          broader dynamics at play. For those seeking a deeper dive, the
          platform provides asset-specific charts that shed light on the
          performance and utilization of each token created within the sandbox.
          Users can explore metrics such as transaction volume, top holders, and
          the current supply of each token, tracking any mints or burns to
          understand supply dynamics over time.
        </Text>
        <br />
        <Text>
          With the Stellar Asset Issuance Sandbox dashboards, users are
          empowered to make informed decisions, monitor the repercussions of
          their actions, and delve into the Stellar network's prowess in asset
          management.
        </Text>
      </Box>
    ),
  },
  {
    title: 'Soroban: The Next Evolution',
    slide: VIDEO_SOROBAN,
    actionName: undefined,
    actionDestination: undefined,
    children: (
      <Box>
        <Text>
          Get ready to unlock a new dimension of possibilities with the Stellar
          network! We're thrilled to announce that the Stellar Asset Issuance
          Sandbox has now integrated features powered by Soroban, Stellar's
          smart contracts platform.
        </Text>
        <br />
        <Text>
          Soroban is set to revolutionize the Stellar ecosystem by introducing
          enhanced programmability, paving the way for more intricate and
          diverse use cases to be constructed. With this integration, users can
          now explore and experiment with the advanced functionalities that
          smart contracts bring to the table, further expanding the horizons of
          what's achievable on the Stellar network.
        </Text>
      </Box>
    ),
  },
]
