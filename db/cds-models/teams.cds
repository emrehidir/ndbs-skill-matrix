using Personnels from './personnel';

entity Teams {
    key ID                     : String(10);
        name                   : String(80);
        headOfTeam             : Personnels:ID;        
        toPersonnels           : Association to many Personnels
                                     on toPersonnels.toTeam = $self;
        toHeadOfTeam           : Association to one Personnels
                                     on toHeadOfTeam.ID = $self.headOfTeam;
};



