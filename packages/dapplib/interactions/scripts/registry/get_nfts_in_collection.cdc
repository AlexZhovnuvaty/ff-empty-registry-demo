import NonFungibleToken from Flow.NonFungibleToken
import RegistrySampleContract from Project.RegistrySampleContract

pub fun main(acct: Address): [UInt64] {
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/NFTCollection)
            .borrow<&RegistrySampleContract.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  return acctNFTCollectionRef.getIDs()
}