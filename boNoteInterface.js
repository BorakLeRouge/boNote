// ==================================================================================================================
//  III  N   N  TTTTT  EEEEE  RRRR   FFFFF    A     CCC   EEEEE        GGG   EEEEE   SSS   TTTTT  III   OOO   N   N
//   I   NN  N    T    E      R   R  F       A A   C   C  E           G   G  E      S        T     I   O   O  NN  N
//   I   N N N    T    EEE    R   R  FFF    A   A  C      EEE         G      EEE     SSS     T     I   O   O  N N N
//   I   N  NN    T    E      RRRR   F      AAAAA  C      E           G  GG  E          S    T     I   O   O  N  NN
//   I   N   N    T    E      R  R   F      A   A  C   C  E           G   G  E          S    T     I   O   O  N   N
//  III  N   N    T    EEEEE  R   R  F      A   A   CCC   EEEEE        GGGG  EEEEE  SSSS     T    III   OOO   N   N
// ==================================================================================================================
// * * * Gestion de l'interface

const vscode = acquireVsCodeApi() ;

// ====================================================================================================================
//  M   M  EEEEE   SSS    SSS     A     GGG   EEEEE       RRRR   EEEEE   CCC   EEEEE  PPPP   TTTTT  III   OOO   N   N
//  MM MM  E      S      S       A A   G   G  E           R   R  E      C   C  E      P   P    T     I   O   O  NN  N
//  M M M  EEE     SSS    SSS   A   A  G      EEE         R   R  EEE    C      EEE    P   P    T     I   O   O  N N N
//  M   M  E          S      S  AAAAA  G  GG  E           RRRR   E      C      E      PPPP     T     I   O   O  N  NN
//  M   M  E          S      S  A   A  G   G  E           R  R   E      C   C  E      P        T     I   O   O  N   N
//  M   M  EEEEE  SSSS   SSSS   A   A   GGGG  EEEEE       R   R  EEEEE   CCC   EEEEE  P        T    III   OOO   N   N
// ====================================================================================================================
// * * * Reception Messages envoyés par la partie VSCode de l'application
window.addEventListener('message', event => {

    const message = event.data ; 

    if (message.action == 'affichage') {
        document.getElementById('contenu').innerHTML = message.contenu ;
    }

} )

// ===============================================================================
//   1   EEEEE  RRRR   EEEEE         A    RRRR   RRRR   III  V   V  EEEEE  EEEEE
//  11   E      R   R  E            A A   R   R  R   R   I   V   V  E      E
//   1   EEE    R   R  EEE         A   A  R   R  R   R   I   V   V  EEE    EEE
//   1   E      RRRR   E           AAAAA  RRRR   RRRR    I    V V   E      E
//   1   E      R  R   E           A   A  R  R   R  R    I    V V   E      E
//  111  EEEEE  R   R  EEEEE       A   A  R   R  R   R  III    V    EEEEE  EEEEE
// ===============================================================================
// * * * 1ere Arrivée : demande de reception des parametres * * *
vscode.postMessage({
    action:  '1er Affichage'
}) ;

// ===========================================================================================
//   OOO   U   U  V   V  RRRR   III  RRRR        FFFFF  III   CCC   H   H  III  EEEEE  RRRR
//  O   O  U   U  V   V  R   R   I   R   R       F       I   C   C  H   H   I   E      R   R
//  O   O  U   U  V   V  R   R   I   R   R       FFF     I   C      HHHHH   I   EEE    R   R
//  O   O  U   U   V V   RRRR    I   RRRR        F       I   C      H   H   I   E      RRRR
//  O   O  U   U   V V   R  R    I   R  R        F       I   C   C  H   H   I   E      R  R
//   OOO    UUU     V    R   R  III  R   R       F      III   CCC   H   H  III  EEEEE  R   R
// ===========================================================================================
// * * * Ouvrir Fichier
function ouvrirFichier(fich) {
    vscode.postMessage({
        action: 'ouvrirFichier',
        contenu: fich      
    })
}
// =============================
//   CCC   L       OOO    GGG
//  C   C  L      O   O  G   G
//  C      L      O   O  G
//  C      L      O   O  G  GG
//  C   C  L      O   O  G   G
//   CCC   LLLLL   OOO    GGGG
// =============================
// * * * clog
function clog(...tb) {
    if(tb.length == 1) {
        console.log(tb[0]);
    } else {
        let first = true ;
        for (let c of tb) {
            if (first) {
                console.groupCollapsed(c) ;
                first = false ;
            } else {
                console.log(c) ;
        }   }  
        console.groupEnd() ;
}   }