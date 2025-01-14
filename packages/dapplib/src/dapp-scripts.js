// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappScripts {

	static flowtoken_get_balance() {
		return fcl.script`
				import FungibleToken from 0xee82856bf20e2aa6
				import FlowToken from 0x0ae53cb6e3f42a79
				
				pub fun main(account: Address): UFix64 {
				
				    let vaultRef = getAccount(account)
				        .getCapability(/public/flowTokenBalance)
				        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
				        ?? panic("Could not borrow Balance reference to the Vault")
				
				    return vaultRef.balance
				}  
		`;
	}

	static registry_get_ehr_hash_values() {
		return fcl.script`
				import RegistrySampleContract from 0x01cf0e2f2f715450
				
				pub fun main(acct: Address): {String: String} {
				  let acctEHRCollectionRef = getAccount(acct).getCapability(/public/NFTCollection)
				            .borrow<&RegistrySampleContract.Collection{RegistrySampleContract.INFTCollectionReviewer}>()
				            ?? panic("Could not borrow the public capability for the recipient's account")
				  // let borrowedEHR = acctEHRCollectionRef.getMetaData()
				  let metadata: {String: String} = acctEHRCollectionRef.getMetaData()
				    //?? panic("Could not borrow EHR hashes from the user's collection")
				  //let metadata: {String: String} = borrowedEHR.metadata
				  return metadata
				}
		`;
	}

	static registry_get_nfts_in_collection() {
		return fcl.script`
				// import NonFungibleToken from Flow.NonFungibleToken
				import RegistrySampleContract from 0x01cf0e2f2f715450
				
				pub fun main(acct: Address): [String] {
				  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/NFTCollection)
				            .borrow<&RegistrySampleContract.Collection{RegistrySampleContract.INFTCollectionReviewer}>()
				            ?? panic("Could not borrow the public capability for the recipient's account")
				
				  return acctNFTCollectionRef.getGrantedAddresses()
				}
		`;
	}

	static registry_has_auth_nft() {
		return fcl.script`
				import RegistryService from 0x01cf0e2f2f715450
				
				// Checks to see if an account has an AuthNFT
				
				pub fun main(tenant: Address): Bool {
				    let hasAuthNFT = getAccount(tenant).getCapability(RegistryService.AuthPublicPath)
				                        .borrow<&RegistryService.AuthNFT{RegistryService.IAuthNFT}>()
				
				    if hasAuthNFT == nil {
				        return false
				    } else {
				        return true
				    }
				}
		`;
	}

}
