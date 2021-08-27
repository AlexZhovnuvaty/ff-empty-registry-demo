// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappTransactions {

	static registry_1_receive_auth_nft() {
		return fcl.transaction`
				import RegistryService from 0x01cf0e2f2f715450
				
				// Allows a Tenant to register with the RegistryService. It will
				// save an AuthNFT to account storage. Once an account
				// has an AuthNFT, they can then get Tenant Resources from any contract
				// in the Registry.
				//
				// Note that this only ever needs to be called once per Tenant
				
				transaction() {
				
				    prepare(signer: AuthAccount) {
				        // if this account doesn't already have an AuthNFT...
				        if signer.borrow<&RegistryService.AuthNFT>(from: RegistryService.AuthStoragePath) == nil {
				            // save a new AuthNFT to account storage
				            signer.save(<-RegistryService.register(), to: RegistryService.AuthStoragePath)
				
				            // we only expose the IAuthNFT interface so all this does is allow us to read
				            // the authID inside the AuthNFT reference
				            signer.link<&RegistryService.AuthNFT{RegistryService.IAuthNFT}>(RegistryService.AuthPublicPath, target: RegistryService.AuthStoragePath)
				        }
				    }
				
				    execute {
				
				    }
				}
		`;
	}

	static registry_3_provision_account() {
		return fcl.transaction`
				import RegistrySampleContract from 0x01cf0e2f2f715450
				import NonFungibleToken from 0x01cf0e2f2f715450
				
				// sets up an account (any user who wants to interact with the Marketplace)
				// the ability to deal with NFTs. It gives them an NFT Collection
				
				transaction {
				
				  prepare(acct: AuthAccount) {
				    // if the account doesn't already have an NFT Collection
				    if acct.borrow<&RegistrySampleContract.Collection>(from: /storage/NFTCollection) == nil {
				
				      // create a new empty collection
				      let nftCollection <- RegistrySampleContract.createEmptyCollection()
				            
				      // save it to the account
				      acct.save(<-nftCollection, to: /storage/NFTCollection)
				
				      // create a public capability for the collection
				      acct.link<&RegistrySampleContract.Collection{RegistrySampleContract.INFTCollectionReporter}>(/private/NFTCollection, target: /storage/NFTCollection)
				    
				      log("Gave account an NFT Collection")
				    }
				  }
				
				  execute {
				    
				  }
				}
				
		`;
	}

	static registry_4_add_asset() {
		return fcl.transaction`
				import NonFungibleToken from 0x01cf0e2f2f715450
				import RegistrySampleContract from 0x01cf0e2f2f715450
				
				// This transction uses the NFTMinter resource to mint a new NFT.
				//
				// It must be run with the account that has a minter resource. In this case,
				// we are calling the transaction with the Tenant itself because it stores
				// an NFTMinter resource in the Tenant resource
				
				transaction(ehr_hash: String) {
				    
				    // the tenant
				    let tenant: &RegistrySampleContract.Tenant
				    let receiver: &RegistrySampleContract.Collection{RegistrySampleContract.INFTCollectionReporter}
				
				    prepare(acct: AuthAccount) {
				
				        self.tenant = acct.borrow<&RegistrySampleContract.Tenant>(from: RegistrySampleContract.TenantStoragePath)
				                        ?? panic("Could not borrow the Tenant")
				         // borrow the recipient's public NFT collection reference
				        self.receiver = acct.getCapability(/private/NFTCollection)
				            .borrow<&RegistrySampleContract.Collection{RegistrySampleContract.INFTCollectionReporter}>()
				            ?? panic("Could not get receiver reference to the EHR hash Collection")
				        
				    }
				
				    execute {
				        // get a reference to an NFTMinter resource from the Tenant
				        let reporter = self.tenant.reporterRef()
				
				        // mint the NFT and deposit it to the recipient's collection
				        reporter.addEHR(tenant: self.tenant, recipient: self.receiver, ehr_hash: ehr_hash)
				    }
				}
		`;
	}

	static registry_5_mint_nft() {
		return fcl.transaction`
				import NonFungibleToken from 0x01cf0e2f2f715450
				import RegistrySampleContract from 0x01cf0e2f2f715450
				
				// This transction uses the NFTMinter resource to mint a new NFT.
				//
				// It must be run with the account that has a minter resource. In this case,
				// we are calling the transaction with the Tenant itself because it stores
				// an NFTMinter resource in the Tenant resource
				
				transaction(recipient: Address, metadata: {String: String}) {
				    
				    // the tenant
				    let tenant: &RegistrySampleContract.Tenant
				    let receiver: &RegistrySampleContract.Collection{NonFungibleToken.CollectionPublic}
				
				    prepare(acct: AuthAccount) {
				
				        self.tenant = acct.borrow<&RegistrySampleContract.Tenant>(from: RegistrySampleContract.TenantStoragePath)
				                        ?? panic("Could not borrow the Tenant")
				         // borrow the recipient's public NFT collection reference
				        self.receiver = getAccount(recipient).getCapability(/public/NFTCollection)
				            .borrow<&RegistrySampleContract.Collection{NonFungibleToken.CollectionPublic}>()
				            ?? panic("Could not get receiver reference to the NFT Collection")
				        
				    }
				
				    execute {
				        // get a reference to an NFTMinter resource from the Tenant
				        let minter = self.tenant.minterRef()
				
				        // mint the NFT and deposit it to the recipient's collection
				        minter.mintNFT(tenant: self.tenant, recipient: self.receiver, metadata: metadata)
				    }
				}
		`;
	}

	static registry_6_assets_list_for_sale() {
		return fcl.transaction`
				import RegistrySampleContract from 0x01cf0e2f2f715450
				
				// Lists an NFT for sale
				
				transaction(id: UInt64, price: UFix64) {
				
				  let saleCollection: &MarketplaceContract.SaleCollection
				
				  prepare(acct: AuthAccount) {
				      self.saleCollection = acct.borrow<&MarketplaceContract.SaleCollection>(from: /storage/SaleCollection) 
				          ?? panic("Could not borrow the user's Sale Collection")
				  }
				
				  execute {
				      self.saleCollection.listForSale(id: id, price: price)
				
				      log("Listed NFT for sale")
				  }
				}
				
		`;
	}

	static registry_7_assets_list_own() {
		return fcl.transaction`
				import RegistrySampleContract from 0x01cf0e2f2f715450
				
				// Lists an NFT for sale
				
				transaction() {
				
				  let ehrCollection: &RegistrySampleContract.Collection
				
				  prepare(acct: AuthAccount) {
				      self.ehrCollection = acct.borrow<&RegistrySampleContract.Collection>(from: RegistrySampleContract.TenantStoragePath) 
				          ?? panic("Could not borrow the user's EHR Collection")
				  }
				
				  execute {
				      self.ehrCollection.getMetaData()
				
				      log("Listed EHRs for user")
				  }
				}
				
		`;
	}

	static registry_2_receive_tenant() {
		return fcl.transaction`
				import RegistrySampleContract from 0x01cf0e2f2f715450
				import RegistryService from 0x01cf0e2f2f715450
				
				// This transaction allows any Tenant to receive a Tenant Resource from
				// RegistrySampleContract. It saves the resource to account storage.
				//
				// Note that this can only be called by someone who has already registered
				// with the RegistryService and received an AuthNFT.
				
				transaction() {
				
				  prepare(signer: AuthAccount) {
				    // save the Tenant resource to the account if it doesn't already exist
				    if signer.borrow<&RegistrySampleContract.Tenant{RegistrySampleContract.ITenantMinter}>(from: RegistrySampleContract.TenantStoragePath) == nil {
				      // borrow a reference to the AuthNFT in account storage
				      let authNFTRef = signer.borrow<&RegistryService.AuthNFT>(from: RegistryService.AuthStoragePath)
				                        ?? panic("Could not borrow the AuthNFT")
				      
				      // save the new Tenant resource from RegistrySampleContract to account storage
				      signer.save(<-RegistrySampleContract.instance(authNFT: authNFTRef), to: RegistrySampleContract.TenantStoragePath)
				
				      // link the Tenant resource to the public
				      //
				      // NOTE: this is commented out for now because it is dangerous to link
				      // our Tenant to the public without any resource interfaces restricting it.
				      // If you add resource interfaces that Tenant must implement, you can
				      // add those here and then uncomment the line below.
				      // 
				      // signer.link<&RegistrySampleContract.Tenant{RegistrySampleContract.INFTCollectionReporter}>(RegistrySampleContract.TenantPublicPath, target: RegistrySampleContract.TenantStoragePath)
				    }
				  }
				
				  execute {
				    log("Registered a new Tenant for RegistrySampleContract.")
				  }
				}
				
		`;
	}

}
