class StatisticsController < ApplicationController
    def index
        ksh_raised = 501
        number_of_features_unlocked = 1
        last_feature_unlocked_at = 250
        next_feature_unlocks_at = 1000

        respond_to do |format|
            format.json { render :json => {
                :ksh_raised => ksh_raised,
                :number_of_features_unlocked => number_of_features_unlocked,
                :last_feature_unlocked_at => last_feature_unlocked_at,
                :next_feature_unlocks_at => next_feature_unlocks_at
            }}
        end
    end
end
