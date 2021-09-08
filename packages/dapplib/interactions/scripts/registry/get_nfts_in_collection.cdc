// import NonFungibleToken from Flow.NonFungibleToken
import RegistrySampleContract from Project.RegistrySampleContract

pub fun main(acct: Address): [String] {
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/NFTCollection)
            .borrow<&RegistrySampleContract.Collection{RegistrySampleContract.INFTCollectionReviewer}>()
            ?? panic("Could not borrow the public capability for the recipient's account")

  return acctNFTCollectionRef.getGrantedAddresses()
}