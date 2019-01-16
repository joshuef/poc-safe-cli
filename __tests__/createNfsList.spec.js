import { createNfsList } from '../src/createNfsList/createNfsList';

jest.unmock( 'solid-auth-client' )
describe( 'createNfsList', () =>
{
    it( 'should exist', () =>
    {
        expect( createNfsList ).toBeDefined();
    } );


    it( 'should create a basic FilesMap', async () =>
    {
        //TESTING
        const url = await createNfsList( {
            'somefile/path'    : 'safe://somewhereerreee',
            'another/path'     : 'safe://else',
            'another/path/sub' : 'safe://again'
        } );

        // logger.info('we have a urll:', url)

        expect( url ).toBeDefined();
        expect( url ).toMatch( 'ssss' );
    } );

} )
