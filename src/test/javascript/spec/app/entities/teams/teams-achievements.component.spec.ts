/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TeamdojoTestModule } from '../../../test.module';
import { TeamsAchievementsComponent } from 'app/teams/teams-achievements.component';
import { TeamsAchievementsService } from 'app/teams/teams-achievements.service';
import { Badge } from 'app/shared/model/badge.model';
import { Level } from 'app/shared/model/level.model';
import { Team } from 'app/shared/model/team.model';
import { Dimension } from 'app/shared/model/dimension.model';

describe('Component Tests', () => {
    describe('Team Achievements Component', () => {
        let comp: TeamsAchievementsComponent;
        let fixture: ComponentFixture<TeamsAchievementsComponent>;
        let service: TeamsAchievementsService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TeamdojoTestModule],
                declarations: [TeamsAchievementsComponent],
                providers: [TeamsAchievementsService]
            })
                .overrideTemplate(TeamsAchievementsComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TeamsAchievementsComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TeamsAchievementsService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            const entity = new Team(122);
            comp.team = entity;
            spyOn(service, 'queryBadges').and.returnValue(
                Observable.of(
                    new HttpResponse({
                        body: [new Badge(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.queryBadges).toHaveBeenCalled();
            expect(comp.badges[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });

        it('Should load levels depending on team participations', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            const entity = new Team(121);
            entity.participations = [new Dimension(122)];
            comp.team = entity;
            spyOn(service, 'queryLevels').and.returnValue(
                Observable.of(
                    new HttpResponse({
                        body: [new Level(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.queryLevels).toHaveBeenCalled();
            expect(comp.levels).toEqual(jasmine.objectContaining({ 122: jasmine.anything() }));
            expect(comp.levels[122]).toBeDefined();
            expect(comp.levels[122][0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
