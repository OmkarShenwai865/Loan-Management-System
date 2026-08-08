class LeadAlreadyExistsError(Exception):
    def __init__(self, lead):
        self.lead = lead
        super().__init__("Lead already exists")
