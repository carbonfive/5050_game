require 'spec_helper'

describe ContentController do
  it 'should redirect to game path for user that has existing donation' do
    get :donate, :name => 'Courtney Hemphill', :amount => 5.0
    session[:uchicken_donor].should == Digest::SHA1.hexdigest("--Courtney Hemphill--5.0--")
    response.should redirect_to game_path
  end

  it 'should redirect to game path if user has already had a session set' do
    session[:uchicken_donor] = Digest::SHA1.hexdigest("--Courtney Hemphill--5.0--")
    get :donate
    response.should redirect_to game_path
  end

  it 'should render error message and donate page if donation is not found' do
    get :donate, :name => 'Courtneys Hemphill', :amount => 12
    flash[:error].should_not be_nil
    response.should render_template('donate')
  end
end
