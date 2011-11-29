class ContentController < ApplicationController
  before_filter :check_donation

  def main
    redirect_to donate_path if !@donated
  end

  def donate
    redirect_to game_path if @donated
  end

  private

  def check_donation
    @donated = false
    @ff = FiftyFifty.new(FIFTYFIFTY_API_KEY).project_donations(42)
    if session[:uchicken_donor].present?
      @donated = true
    elsif params[:donation_id].nil?
      flash[:notice] = 'You will need to donate in order to play! Enter your donation id in the field below or click make a donation to donate.'
      @donated = false
    elsif @ff.select{|d| d.id == params[:donation_id].to_f}.present?
      user = @ff.select{|d| d.id == params[:donation_id].to_f}.first
      session[:uchicken_donor] = Digest::SHA1.hexdigest("--#{user.id}--#{user.amount}--")
      flash[:notice] = "Thank you for your donation. Your user id is #{user.id}. If you ever lose your session you can enter this id in to return to play."
      @donated = true
    else
      flash[:error] = 'You will need to donate in order to play! Enter your donation id in the field below or click make a donation to donate.'
      @donated = false
    end
  end
end