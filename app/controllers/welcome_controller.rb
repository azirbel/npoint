class WelcomeController < ApplicationController
  def index
    @documents = Document.all
  end
end
