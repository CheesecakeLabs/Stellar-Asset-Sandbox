# Token Main Vault

The Token Main Vault in the Stellar Asset Issuance Sandbox is a strategic implementation of the Stellar network's best practice pattern involving an issuing and a distribution account. This pattern is pivotal in asset management, designed to enhance security and simplify auditing processes. The Sandbox follows this pattern and abstracts it, offering the Token Main Vault as the primary means to interact with and manage the asset.

## **The Issuing and Distribution Account Pattern in Stellar**

This pattern on the Stellar network involves two critical accounts:

* **Issuing Account:** Responsible for creating the asset, this account mints the digital asset on the Stellar network. It is intrinsically linked to the asset's identity, requiring other accounts to establish a trustline for asset holding.
* **Distribution Account:** After minting, the asset is transferred to this account, which becomes the primary conduit for all subsequent transactions and distributions.

The issuing and distribution account pattern is vital in the Stellar network for ensuring the security and traceability of digital assets. It provides a clear separation between the creation and distribution of assets, significantly enhancing the safety and auditability of asset transactions. For further details, please refer to [Stellar's official documentation](https://developers.stellar.org/docs/issuing-assets/control-asset-access).

## **The Sandbox's Approach: Simplifying with the Token Main Vault**

In the Stellar Asset Issuance Sandbox, this distribution account is elegantly transformed into the 'Token Main Vault'. It aligns with the Stellar network’s practices but enhances user experience by automating and integrating key functionalities.

* **Automated Creation:** The Token Main Vault is automatically set up when an asset is created in the Sandbox, streamlining the initial steps in asset management.
* **Centralized Asset Hub:** It becomes the central repository for all newly minted units and serves as the point for burning units, thus providing a comprehensive control mechanism over the asset’s supply.
* **Exclusive Management Access:** The Vault is managed exclusively by the asset manager. This role includes the distribution of the asset to other vaults, user wallets, and external accounts, ensuring secure and regulated control.

In summary, the Token Main Vault in the Stellar Asset Issuance Sandbox is an adaptation of the issuing and distribution account pattern from the Stellar network. It offers a simplified, automated solution for asset managers to effectively control and distribute their digital assets, while maintaining the security and auditing standards essential in digital asset management.

For further detail on how to visualize and manage the Main Vault, refer to the[supply-management.md](../core-functionalities/token-management/supply-management.md "mention") article.
