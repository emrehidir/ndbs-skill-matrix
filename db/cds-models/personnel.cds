using {managed} from '@sap/cds/common';
using Countries from './configurations';
using Teams from './teams';

entity Personnels : managed {
    key ID                 : String(12);
        firstName          : String(40) not null;
        lastName           : String(40) not null;
        country            : Countries:code not null;
        teamID             : Teams:ID;
        isActive           : Boolean;
        email              : String(255)             @Communication.IsEmailAddress;
        userRole           : String(1);
        sfUser             : String(15);
        isDedicated        : Boolean;
        toTeam             : Association to one Teams
                                 on toTeam.ID = $self.teamID;
        toUserIDs          : Composition of many PersonnelUsers
                                 on toUserIDs.toPersonnel = $self;
};

entity PersonnelUsers {
    key userID        : Personnels:ID;
    key personnelID   : Personnels:ID;
        isDefaultUser : Boolean;
        country       : Countries:code;
        toPersonnel   : Association to Personnels
                            on toPersonnel.ID = $self.personnelID;
};