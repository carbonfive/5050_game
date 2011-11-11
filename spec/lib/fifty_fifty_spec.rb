require 'spec_helper'

describe FiftyFifty do
  before do
    @ff = FiftyFifty.new(FIFTYFIFTY_API_KEY)
  end
  it 'successfully returns from api request' do
    @ff.statistics.project_count.should be > 0
  end

  it 'returns the correct project details for uchicken project id 42' do
    @ff.project_details(42).id.should == 42
  end

  it 'returns a request for a user donation based on name and amount' do
    @ff.project_donations(42).select{|d| d.name == 'Courtney Hemphill'}.should_not be_nil
  end

end