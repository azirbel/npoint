class PagesController < ApplicationController
  def letsencrypt
    render text: 'WMR9ZsaN_jU71mT7d4Z59RBrRZa4Nw80Ms61cfmhXWY.zLIPGlf6RF91pv4gcIvNFP4LBSZuI50mb1A25VgBjck'
  end

  def letsencrypt_api
    render text: 'jEd9Iw3Oi37AY-h2GsmmaFvjE8z3MnUSP1CaR_vMOtM.zLIPGlf6RF91pv4gcIvNFP4LBSZuI50mb1A25VgBjck'
  end
end
