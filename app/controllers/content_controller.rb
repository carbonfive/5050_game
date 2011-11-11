class ContentController < ApplicationController
  def main
  end

  def donate
    @ff = FiftyFifty.new(FIFTYFIFTY_API_KEY).project_donations(42)
    if session[:uchicken_donor].present?
      redirect_to game_path
    elsif params[:name].nil?
      return true
    elsif !@ff.select{|d| d.name == params[:name]}.empty?
      user = @ff.select{|d| d.name == params[:name]}.first
      session[:uchicken_donor] = Digest::SHA1.hexdigest("--#{user.name}--#{user.amount}--")
      redirect_to game_path
    else
      flash[:error] = 'You will need to donate in order to play!'
    end
  end
end