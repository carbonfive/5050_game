require 'httparty'
require 'hashie'

class FiftyFifty
  include HTTParty

  class BadRequest < StandardError; end

  format :json

  def initialize(api_key)
     @api_key = api_key
     self.class.base_uri "5050.gd/api/#{@api_key}"
  end

  def statistics
    return get("/statistics")
  end

  # Lists all current 50/50 projects.
  def projects
    return get("/projects/list")
  end

  # Show details for specific project.
  def project_details(project_id)
    return get("/projects/#{project_id}")
  end

  # List donations for a specific project.
  def project_donations(project_id)
    return get("/projects/#{project_id}/donations")
  end

  # Notify us of a new donation, i.e. one that you may have received in person,
  # or from another online payment mechanism. Your API key must be associated
  # with the requested project for this to be successful.
  def register_project_donation(project_id, amount)
    return get("/projects/#{project_id}/donations/notify/#{amount}")
  end

  # List of users who have pledged to take part in a specific project.
  def project_pledges(project_id)
    return get("/projects/#{project_id}/pledges")
  end

  def project_search(project_id)
    return Hashie::Mash.new(self.class.get("/projects/#{project_id}/donations/search?name%3DCourtney%20Hemphill")).data
  end

  # List all campaigners currently running projects on 50/50.
  def campaigners
    return get("/campaigners/list")
  end

  # Show details for a specific campaigner.
  def campaigner_details(campaigner_id)
    return get("/campaigners/#{campaigner_id}")
  end

  # Get's response for a URL request. If the status is 400, raise a BadRequest
  # exception, otherwise, return the associated data
  def get(url)
    response = Hashie::Mash.new(self.class.get(url))
    if response.status == 400
      raise BadRequest
    else
      return response.data
    end
  end
end