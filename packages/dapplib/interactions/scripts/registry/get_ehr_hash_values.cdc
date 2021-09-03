import RegistrySampleContract from Project.RegistrySampleContract

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